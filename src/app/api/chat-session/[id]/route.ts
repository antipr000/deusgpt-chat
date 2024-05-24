import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


import ChatRepository from '../../db/repositories/chat.repository';
import { getUidFromIdToken } from '../../firebase/utils';

export async function DELETE(request: NextRequest, { params }: {params: { id: string}}) {
    const headerList = headers();
    const idToken: string | null = headerList.get('authorization');
  
    if (!idToken) {
      return NextResponse.json({}, { status: 401 });
    }
    await getUidFromIdToken(idToken);

    const { id } = params;
  
    const chatRepository = new ChatRepository();
    const session = await chatRepository.deleteChatSession(id);
    return NextResponse.json(session);
  }