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

  async getUsageForToday(firebaseId: String, modelId: String): Promise<Number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const usageModel = await this.dbProvider.getUsageModel();
    const count = await usageModel.countDocuments({
      firebaseId: firebaseId,
      modelId: modelId,
      createdAt: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });

    return count;
  }
}

export default UsageRepository;
