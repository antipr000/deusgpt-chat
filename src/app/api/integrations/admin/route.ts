import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import IntegrationRepository from '../../db/repositories/integration.repository';
import UserRepository from '../../db/repositories/user.repository';
import { getUidFromIdToken } from '../../firebase/utils';

export async function GET() {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const userRepository = new UserRepository();
  const integrationRepository = new IntegrationRepository();

  const user = await userRepository.getUserByFirebaseId(firebaseId);

  if (!user.isAdmin) {
    return NextResponse.json({}, { status: 403 });
  }
  const data = await integrationRepository.adminGetAllIntegrations();
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const userRepository = new UserRepository();
  const integrationRepository = new IntegrationRepository();

  const user = await userRepository.getUserByFirebaseId(firebaseId);

  if (!user.isAdmin) {
    return NextResponse.json({}, { status: 403 });
  }

  const body = await request.json();
  const name = body['name'];
  const integration = await integrationRepository.updateIntegration(name, body);
  return NextResponse.json(integration);
}
