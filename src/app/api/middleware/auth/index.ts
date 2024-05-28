import { AuthObject } from '@clerk/backend/internal';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { createErrorResponse } from '@/app/api/errorResponse';
import { JWTPayload, LOBE_CHAT_AUTH_HEADER, OAUTH_AUTHORIZED, enableClerk } from '@/const/auth';
import { AgentRuntimeError, ChatCompletionErrorPayload } from '@/libs/agent-runtime';
import { Integration } from '@/types/common/Integration.type';
import { ChatErrorType } from '@/types/fetch';

import IntegrationRepository from '../../db/repositories/integration.repository';
import { getUidFromIdToken } from '../../firebase/utils';
import { checkAuthMethod, getJWTPayload } from './utils';

type RequestOptions = { params: { provider: string } };

export type RequestHandler = (
  req: Request,
  options: RequestOptions & { jwtPayload: JWTPayload },
) => Promise<Response>;

export const checkAuth =
  (handler: RequestHandler) => async (req: Request, options: RequestOptions) => {
    // try {
    //   // get Authorization from header
    //   const authorization = req.headers.get(LOBE_CHAT_AUTH_HEADER);
    //   const oauthAuthorized = !!req.headers.get(OAUTH_AUTHORIZED);

    //   if (!authorization) throw AgentRuntimeError.createError(ChatErrorType.Unauthorized);

    //   // check the Auth With payload and clerk auth
    //   let clerkAuth = {} as AuthObject;

    //   if (enableClerk) {
    //     clerkAuth = getAuth(req as NextRequest);
    //   }

    //   jwtPayload = await getJWTPayload(authorization);

    //   checkAuthMethod({
    //     accessCode: jwtPayload.accessCode,
    //     apiKey: jwtPayload.apiKey,
    //     clerkAuth,
    //     nextAuthAuthorized: oauthAuthorized,
    //   });
    // } catch (e) {
    //   const {
    //     errorType = ChatErrorType.InternalServerError,
    //     error: errorContent,
    //     ...res
    //   } = e as ChatCompletionErrorPayload;

    //   const error = errorContent || e;

    //   return createErrorResponse(errorType, { error, ...res, provider: options.params?.provider });
    // }
    // Check auth first
    const idToken = req.headers.get(LOBE_CHAT_AUTH_HEADER);
    const uid = await getUidFromIdToken(idToken!!);
    if (!uid) {
      return NextResponse.json({}, { status: 401 });
    }
    const { provider } = options.params;
    const integrationRepository = new IntegrationRepository();
    const secrets: Integration = await integrationRepository.getIntegrationByName(provider);
    let jwtPayload: JWTPayload = {
      accessCode: secrets.secret,
      apiKey: secrets.secret,
    };
    return handler(req, { ...options, jwtPayload });
  };
