import mongoose from 'mongoose';

import { Chat } from '../../../../types/common/Chat.type';
import { ChatSession } from '../../../../types/common/ChatSession.type';

const chatSchema = new mongoose.Schema<Chat>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const chatSessionSchema = new mongoose.Schema<ChatSession>({
  firebaseId: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  agent: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  messages: {
    type: [chatSchema],
    required: false,
    default: [],
  },
});

const ChatSessionModel =
  mongoose.models?.ChatSession || mongoose.model('ChatSession', chatSessionSchema);

export { ChatSessionModel };
