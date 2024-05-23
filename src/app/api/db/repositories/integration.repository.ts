import { Integration } from '../../../../types/common/Integration.type';
import DBProvider from '../mongo.client';

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

  async getAllIntegrations(): Promise<Partial<Integration>> {
    const integrationModel = await this.dbProvider.getIntegrationModel();
    const data: Integration[] = await integrationModel.find({ enabled: true });
    console.log('Got', data);
    const finalData = data.map(({ displayName, enabled, name, models }) => ({
      displayName,
      enabled,
      name,
      models,
    }));
    return finalData as Partial<Integration>;
  }
}

export default IntegrationRepository;
