import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ChatSession } from '@/types/common/ChatSession.type';

import ChatRepository from '../db/repositories/chat.repository';

export async function GET() {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  // const firebaseId = await getUidFromIdToken(idToken);
  const firebaseId = 'Rjzn2cqUKHMMOhFpvBxfmeVKs2m1';

  const chatRepository = new ChatRepository();
  const data = await chatRepository.getAllChatSessions(firebaseId);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const headerList = headers();
  const idToken: string | null = headerList.get('authorization');

  if (!idToken) {
    return NextResponse.json({}, { status: 401 });
  }
  // const firebaseId = await getUidFromIdToken(idToken);
  const firebaseId = 'Rjzn2cqUKHMMOhFpvBxfmeVKs2m1';

  const body: ChatSession = await request.json();
  body.firebaseId = firebaseId;
  const chatRepository = new ChatRepository();
  const session = await chatRepository.createChatSession(body);
  return NextResponse.json(session);
}
