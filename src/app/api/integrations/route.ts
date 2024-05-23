import { NextResponse } from 'next/server';

import IntegrationRepository from '../db/repositories/integration.repository';

export async function GET() {
  const integrationRepository = new IntegrationRepository();
  const data = await integrationRepository.getAllIntegrations();
  return NextResponse.json(data);
}
