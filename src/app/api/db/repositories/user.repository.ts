import { User } from '@/types/common/User.type';

import DBProvider from '../mongo.client';

class UserRepository {
  private dbProvider: DBProvider;
  constructor() {
    this.dbProvider = new DBProvider();
  }

  async createNewUser(userData: User) {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.create(userData);
    return data;
  }

  async getAllUsers() {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.find();
    return data;
  }

  async getUserById(id: string) {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.findById(id);
    return data;
  }

  async getUserByFirebaseId(firebaseId: string) {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.findOne({ firebaseId });
    return data;
  }

  async getUserByStripeCustomerId(stripeCustomerId: string) {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.findOne({ stripeCustomerId });
    return data;
  }

  async getUserByEmail(email: string) {
    const userModel = await this.dbProvider.getUserModel();
    const data = userModel.findOne({ email: email });
    return data;
  }

  async updateUser(firebaseId: string, userData: Partial<User>) {
    const userModel = await this.dbProvider.getUserModel();
    const data = userModel.findOneAndUpdate({ firebaseId }, userData, {
      new: true,
    });
    return data;
  }

  async getUsersForDateRange(startDate: Date, endDate?: Date) {
    const userModel = await this.dbProvider.getUserModel();
    const data = await userModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate || new Date(),
      },
    });
    return data.length;
  }

  async deleteUser(firebaseId: string) {
    const userModel = await this.dbProvider.getUserModel();
    await userModel.findOneAndDelete({ firebaseId });
  }
}

export default UserRepository;
