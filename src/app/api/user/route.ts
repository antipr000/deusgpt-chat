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
