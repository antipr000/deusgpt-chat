import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import UserRepository from '../db/repositories/user.repository';
import { getUidFromIdToken } from '../firebase/utils';

export async function PATCH(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);
  const requestBody = await request.json();
  const userRepository = new UserRepository();
  const userData = await userRepository.updateUser(firebaseId, requestBody);
  return NextResponse.json(userData);
}

export async function GET(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  await getUidFromIdToken(idToken);
  const startDate = request.nextUrl.searchParams.get('startDate') as string;
  const endDate = request.nextUrl.searchParams.get('endDate') || '';

  const userRepository = new UserRepository();

  if (startDate) {
    const users = await userRepository.getUsersForDateRange(new Date(startDate), new Date(endDate));
    return NextResponse.json(users);
  }

  const users = await userRepository.getAllUsers();
  return NextResponse.json(users);
}
