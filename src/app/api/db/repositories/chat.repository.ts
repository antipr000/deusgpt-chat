import chat from '@/locales/default/chat';

import DBProvider from '../mongo.client';
import { ChatSession } from '../types/ChatSession.type';

class ChatRepository {
  private dbProvider: DBProvider;
  constructor() {
    this.dbProvider = new DBProvider();
  }

  async createChatSession(request: ChatSession): Promise<ChatSession> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSession = await chatSessionModel.create(request);
    return chatSession;
  }

  async updateChatSession(sessionId: String, request: Partial<ChatSession>): Promise<ChatSession> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSession = await chatSessionModel.findOneAndUpdate({ sessionId }, request, {
      new: true,
    });
    return chatSession;
  }

  async getAllChatSessions(firebaseId: String): Promise<ChatSession[]> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSessions = await chatSessionModel.find({ firebaseId });
    return chatSessions;
  }
}

export default ChatRepository;
