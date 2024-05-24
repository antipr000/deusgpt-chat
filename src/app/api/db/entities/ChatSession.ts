import mongoose, { Schema } from 'mongoose';

import { ChatSession } from '@/types/common/ChatSession.type';
import { ChatMessage, ChatMessageError, ChatTTS , ChatPluginPayload, ChatToolPayload } from '@/types/message';

import { MetaData } from '@/types/meta';

const chatToolPayloadSchema = new mongoose.Schema<ChatToolPayload>({
  apiName: {
    required: true,
    type: String,
  },
  arguments: {
    required: true,
    type: String,
  },
  id: {
    required: true,
    type: String,
  },
  identifier: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
});

const chatPluginPayloadSchema = new mongoose.Schema<ChatPluginPayload>({
  apiName: {
    required: true,
    type: String,
  },
  arguments: {
    required: true,
    type: String,
  },
  identifier: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
});

const chatTranslateSchema = new mongoose.Schema({
  content: {
    required: false,
    type: String,
  },
});

const chatTTSSchema = new mongoose.Schema<ChatTTS>({
  contentMd5: {
    required: false,
    type: String,
  },
  file: {
    required: false,
    type: String,
  },
  voice: {
    required: false,
    type: String,
  },
});

const extraSchema = new mongoose.Schema({
  fromModel: {
    required: false,
    type: String,
  },
  fromProvider: {
    required: false,
    type: String,
  },
  translate: {
    required: false,
    type: chatTranslateSchema,
  },
  tts: {
    required: false,
    type: chatTTSSchema,
  },
});

const chatMessageErrorSchema = new mongoose.Schema<ChatMessageError>({
  body: {
    required: false,
    type: Schema.Types.Mixed,
  },
  message: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
});

const metadataSchema = new mongoose.Schema<MetaData>({
  avatar: {
    required: false,
    type: String,
  },
  backgroundColor: {
    required: false,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  tags: {
    required: false,
    type: [String],
  },
  title: {
    required: false,
    type: String,
  },
});

export const chatSchema = new mongoose.Schema<ChatMessage>({
  content: {
    required: false,
    type: String,
  },
  createdAt: {
    required: true,
    type: Number,
  },
  error: {
    required: false,
    type: chatMessageErrorSchema,
  },
  extra: {
    required: false,
    type: extraSchema,
  },
  files: {
    required: false,
    type: [String],
  },
  id: {
    required: true,
    type: String,
    unique: true,
  },
  meta: {
    required: false,
    type: metadataSchema,
  },
  observationId: {
    required: false,
    type: String,
  },
  parentId: {
    required: false,
    type: String,
  },
  plugin: {
    required: false,
    type: chatPluginPayloadSchema,
  },
  pluginState: {
    required: false,
    type: Schema.Types.Mixed,
  },
  quotaId: {
    required: false,
    type: String,
  },
  role: {
    required: true,
    type: String,
  },
  sessionId: {
    required: false,
    type: String,
  },
  tool_call_id: {
    required: false,
    type: String,
  },
  tools: {
    required: false,
    type: chatToolPayloadSchema,
  },
  topicId: {
    required: false,
    type: String,
  },
  traceId: {
    required: false,
    type: String,
  },
  updatedAt: {
    required: true,
    type: Number,
  },
});

const chatSessionSchema = new mongoose.Schema<ChatSession>({
  agent: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    required: true,
    type: Date,
  },
  firebaseId: {
    required: true,
    type: String,
  },
  name: {
    required: false,
    type: String,
  },
  sessionId: {
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
});

const ChatSessionModel =
  mongoose.models?.ChatSession || mongoose.model('ChatSession', chatSessionSchema);

export { ChatSessionModel };
