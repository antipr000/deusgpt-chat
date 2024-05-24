import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Usage } from '@/types/common/Usage.type';

import UsageRepository from '../db/repositories/usage.repository';
import { getUidFromIdToken } from '../firebase/utils';

export async function POST(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const body: Usage = await request.json();
  body.firebaseId = firebaseId;
  body.createdAt = new Date();

  const usageRepository = new UsageRepository();

  await usageRepository.createUsage(body);

  const count = await usageRepository.getUsageForToday(firebaseId, body.modelId);
  return NextResponse.json({ count });
}

export async function GET(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);
  const modelId: string | null = request.nextUrl.searchParams.get('model');

  if (!modelId) {
    return NextResponse.json({}, { status: 404 });
  }

  const usageRepository = new UsageRepository();
  const count = await usageRepository.getUsageForToday(firebaseId, modelId);
  return NextResponse.json({ count });
}
