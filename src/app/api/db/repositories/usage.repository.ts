import { Usage } from '@/types/common/Usage.type';

import DBProvider from '../mongo.client';

class UsageRepository {
  private dbProvider: DBProvider;
  constructor() {
    this.dbProvider = new DBProvider();
  }

  async createUsage(data: Usage): Promise<Usage> {
    const usageModel = await this.dbProvider.getUsageModel();
    const usage: Usage = await usageModel.create(data);
    return usage;
  }

  async getUsageForToday(firebaseId: string, modelId: string): Promise<number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const usageModel = await this.dbProvider.getUsageModel();
    const count = await usageModel.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
      firebaseId: firebaseId,
      modelId: modelId,
    });

    return count;
  }

  async getUsageForDateRange(startDate: Date, endDate?: Date): Promise<number> {
    const usageModel = await this.dbProvider.getUsageModel();
    const count = await usageModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate || new Date(),
      },
    });

    return count;
  }
}

export default UsageRepository;
