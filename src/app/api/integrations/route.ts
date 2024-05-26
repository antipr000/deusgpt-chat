import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import IntegrationRepository from '../db/repositories/integration.repository';
import UserRepository from '../db/repositories/user.repository';
import { getUidFromIdToken } from '../firebase/utils';

export async function GET() {
  const integrationRepository = new IntegrationRepository();
  const data = await integrationRepository.getAllIntegrations();
  return NextResponse.json(data);
}
