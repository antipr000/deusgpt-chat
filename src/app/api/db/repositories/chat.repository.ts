import { ChatSession } from '../../../../types/common/ChatSession.type';
import DBProvider from '../mongo.client';

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

  async updateChatSession(sessionId: string, request: Partial<ChatSession>): Promise<ChatSession> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSession = await chatSessionModel.findOneAndUpdate({ sessionId }, request, {
      new: true,
    });
    return chatSession;
  }

  async getAllChatSessions(firebaseId: string): Promise<ChatSession[]> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSessions = await chatSessionModel.find({ firebaseId }).sort({ createdAt: -1 });
    return chatSessions;
  }

  async deleteChatSession(sessionId: string): Promise<ChatSession[]> {
    const chatSessionModel = await this.dbProvider.getChatSessionModel();
    const chatSession = await chatSessionModel.findOneAndDelete({ sessionId });
    return chatSession;
  }
}

export default ChatRepository;
