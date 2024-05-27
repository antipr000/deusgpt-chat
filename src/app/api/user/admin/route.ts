import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import UserRepository from '../../db/repositories/user.repository';
import { getUidFromIdToken } from '../../firebase/utils';

export async function PATCH(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const userRepository = new UserRepository();

  const user = await userRepository.getUserByFirebaseId(firebaseId);

  if (!user.isAdmin) {
    return NextResponse.json({}, { status: 403 });
  }
  const body = await request.json();
  const data = await userRepository.updateUser(body.firebaseId, body);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const userRepository = new UserRepository();

  const user = await userRepository.getUserByFirebaseId(firebaseId);

  if (!user.isAdmin) {
    return NextResponse.json({}, { status: 403 });
  }

  const fbId = request.nextUrl.searchParams.get('fbId') as string;

  await userRepository.deleteUser(fbId);
  return NextResponse.json({});
}
