import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import UsageRepository from '../../db/repositories/usage.repository';
import { getUidFromIdToken } from '../../firebase/utils';

export async function GET(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  await getUidFromIdToken(idToken);
  const modelsQuery = request.nextUrl.searchParams.get('models') as string;
  const startDate = request.nextUrl.searchParams.get('startDate') as string;
  const endDate = request.nextUrl.searchParams.get('endDate') || '';

  const models = decodeURIComponent(modelsQuery).split(',');

  const usageRepository = new UsageRepository();
  const count = await usageRepository.getUsageForDateRange(
    models,
    new Date(startDate),
    new Date(endDate),
  );
  return NextResponse.json({ count });
}
