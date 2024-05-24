import mongoose, { Schema } from 'mongoose';

import { ChatSession } from '@/types/common/ChatSession.type';
import { ChatMessage, ChatMessageError, ChatTTS, ChatTranslate } from '@/types/message';
import { ChatPluginPayload, ChatToolPayload } from '@/types/message';
import { MetaData } from '@/types/meta';

const chatToolPayloadSchema = new mongoose.Schema<ChatToolPayload>({
  apiName: {
    type: String,
    required: true,
  },
  arguments: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const chatPluginPayloadSchema = new mongoose.Schema<ChatPluginPayload>({
  apiName: {
    type: String,
    required: true,
  },
  arguments: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const chatTranslateSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
  },
});

const chatTTSSchema = new mongoose.Schema<ChatTTS>({
  contentMd5: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
  },
  voice: {
    type: String,
    required: false,
  },
});

const extraSchema = new mongoose.Schema({
  fromModel: {
    type: String,
    required: false,
  },
  fromProvider: {
    type: String,
    required: false,
  },
  translate: {
    type: chatTranslateSchema,
    required: false,
  },
  tts: {
    type: chatTTSSchema,
    required: false,
  },
});

const chatMessageErrorSchema = new mongoose.Schema<ChatMessageError>({
  body: {
    type: Schema.Types.Mixed,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const metadataSchema = new mongoose.Schema<MetaData>({
  avatar: {
    type: String,
    required: false,
  },
  backgroundColor: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
});

const chatSchema = new mongoose.Schema<ChatMessage>({
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
  meta: {
    type: metadataSchema,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  error: {
    type: chatMessageErrorSchema,
    required: false,
  },
  extra: {
    type: extraSchema,
    required: false,
  },
  files: {
    type: [String],
    required: false,
  },
  observationId: {
    type: String,
    required: false,
  },
  parentId: {
    type: String,
    required: false,
  },
  plugin: {
    type: chatPluginPayloadSchema,
    required: false,
  },
  pluginState: {
    type: Schema.Types.Mixed,
    required: false,
  },
  quotaId: {
    type: String,
    required: false,
  },
  sessionId: {
    type: String,
    required: false,
  },
  tool_call_id: {
    type: String,
    required: false,
  },
  tools: {
    type: chatToolPayloadSchema,
    required: false,
  },
  topicId: {
    type: String,
    required: false,
  },
  traceId: {
    type: String,
    required: false,
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
