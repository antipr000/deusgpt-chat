import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import PaymentRepository from '../db/repositories/payment.repository';
import UserRepository from '../db/repositories/user.repository';
import { getUidFromIdToken } from '../firebase/utils';

export async function GET() {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  const firebaseId = await getUidFromIdToken(idToken);

  const userRepository = new UserRepository();
  const paymentRepository = new PaymentRepository();

  const user = await userRepository.getUserByFirebaseId(firebaseId);

  if (!user.isAdmin) {
    return NextResponse.json({}, { status: 403 });
  }
  const data = await paymentRepository.getAllPayments();
  return NextResponse.json(data);
}
