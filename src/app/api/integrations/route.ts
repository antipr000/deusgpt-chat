// import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import IntegrationRepository from '../db/repositories/integration.repository';
// import UserRepository from '../db/repositories/user.repository';
// import { getUidFromIdToken } from '../firebase/utils';

export const dynamic = 'force-dynamic' 

export async function GET() {
  const integrationRepository = new IntegrationRepository();
  const data = await integrationRepository.getAllIntegrations();
  return NextResponse.json(data);
}
