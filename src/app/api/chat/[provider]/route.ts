import { getPreferredRegion } from '@/app/api/config';
import { createErrorResponse } from '@/app/api/errorResponse';
import { ChatCompletionErrorPayload } from '@/libs/agent-runtime';
import { ChatErrorType } from '@/types/fetch';
import { ChatStreamPayload } from '@/types/openai/chat';
import { getTracePayload } from '@/utils/trace';

import IntegrationRepository from '../../db/repositories/integration.repository';
import { Integration } from '../../db/types/Integration.type';
import { checkAuth } from '../../middleware/auth';
import { createTraceOptions, initAgentRuntimeWithUserPayload } from '../agentRuntime';

export const preferredRegion = getPreferredRegion();

export const POST = checkAuth(async (req: Request, { params, jwtPayload }) => {
  const { provider } = params;

  try {
    const integrationRepository = new IntegrationRepository();
    const secrets: Integration = await integrationRepository.getIntegrationByName(provider);
    // ============  1. init chat model   ============ //
    const agentRuntime = await initAgentRuntimeWithUserPayload(provider, {
      accessCode: secrets.secret as string,
      apiKey: secrets.secret as string,
    });

    // ============  2. create chat completion   ============ //

    const data = (await req.json()) as ChatStreamPayload;

    const tracePayload = getTracePayload(req);

    // If user enable trace
    if (tracePayload?.enabled) {
      return await agentRuntime.chat(
        data,
        createTraceOptions(data, {
          provider,
          trace: tracePayload,
        }),
      );
    }
    return await agentRuntime.chat(data);
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;
    // track the error at server side
    console.error(`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});
