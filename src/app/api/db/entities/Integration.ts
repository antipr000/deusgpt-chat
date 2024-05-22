import mongoose from 'mongoose';

import { Integration, Model } from '../types/Integration.type';

const modelSchema = new mongoose.Schema<Model>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const integrationSchema = new mongoose.Schema<Integration>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  secret: {
    type: String,
    required: false,
  },
  proxy: {
    type: String,
    required: false,
  },
  enabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  models: {
    type: [modelSchema],
    required: false,
  },
});

// Take from already created schema if present, otherwise errors on hot reloading
const IntegrationModel =
  mongoose.models?.Integration || mongoose.model('Integration', integrationSchema);

export { IntegrationModel };
