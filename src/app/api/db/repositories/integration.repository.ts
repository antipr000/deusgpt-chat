import DBProvider from '../mongo.client';
import { Integration } from '../types/Integration.type';

class IntegrationRepository {
  private dbProvider: DBProvider;
  constructor() {
    this.dbProvider = new DBProvider();
  }

  async createNewIntegration(integrationData: Integration): Promise<Integration> {
    const integrationModel = await this.dbProvider.getIntegrationModel();
    const data = await integrationModel.create(integrationData);
    return data;
  }

  async getIntegrationByName(name: String): Promise<Integration> {
    const integrationModel = await this.dbProvider.getIntegrationModel();
    const data = await integrationModel.findOne({ name });
    return data;
  }
}

export default IntegrationRepository;
