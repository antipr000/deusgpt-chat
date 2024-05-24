import mongoose from 'mongoose';

import { Usage } from '@/types/common/Usage.type';

const usageSchema = new mongoose.Schema<Usage>({
  chatId: {
    required: false,
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
  modelId: {
    required: true,
    type: String,
  },
  queryType: {
    required: false,
    type: String,
  },
});

// Take from already created schema if present, otherwise errors on hot reloading
const UsageModel = mongoose.models?.Usage || mongoose.model('Usage', usageSchema);

export { UsageModel };
