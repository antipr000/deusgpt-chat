import mongoose from 'mongoose';

import { ChatSessionModel } from './entities/ChatSession';
import { IntegrationModel } from './entities/Integration';
import { PaymentModel } from './entities/Payment';
import { UsageModel } from './entities/Usage';
import { UserModel } from './entities/User';

const DATABASE_URL = process.env.MONGO_URI;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(DATABASE_URL!!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

class DBProvider {
  async getIntegrationModel() {
    await connectDB();
    return IntegrationModel;
  }

  async getChatSessionModel() {
    await connectDB();
    return ChatSessionModel;
  }

  async getUsageModel() {
    await connectDB();
    return UsageModel;
  }

  async getUserModel() {
    await connectDB();
    return UserModel;
  }

  async getPaymentModel() {
    await connectDB();
    return PaymentModel;
  }
}

export default DBProvider;
