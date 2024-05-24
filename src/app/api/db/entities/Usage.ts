import mongoose from 'mongoose';

import { Usage } from '@/types/common/Usage.type';

const usageSchema = new mongoose.Schema<Usage>({
  firebaseId: {
    type: String,
    required: true,
  },
  modelId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  queryType: {
    type: String,
    required: false,
  },
  chatId: {
    type: String,
    required: false,
  },
});

// Take from already created schema if present, otherwise errors on hot reloading
const UsageModel = mongoose.models?.Usage || mongoose.model('Usage', usageSchema);

export { UsageModel };
