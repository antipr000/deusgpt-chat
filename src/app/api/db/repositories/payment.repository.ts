import { Payment, PaymentStatus, PaymentWithUser } from '@/types/common/Payment.type';
import { Usage } from '@/types/common/Usage.type';

import DBProvider from '../mongo.client';

class PaymentRepository {
  private dbProvider: DBProvider;
  constructor() {
    this.dbProvider = new DBProvider();
  }

  async getAllPayments(): Promise<PaymentWithUser[]> {
    const paymentModel = await this.dbProvider.getPaymentModel();

    const data = await paymentModel
      .aggregate([
        {
          $match: {
            status: {
              $in: [PaymentStatus.SUCCESS, PaymentStatus.FAILURE, PaymentStatus.CANCELLED],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'firebaseId',
            foreignField: 'firebaseId',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            'sessionId': 1,
            'status': 1,
            'plan': 1,
            'amount': 1,
            'completedAt': 1,
            'createdAt': 1,
            'invoiceId': 1,
            'user.email': 1,
            'user.firstName': 1,
            'user.lastName': 1,
          },
        },
      ])
      .sort({ createdAt: -1 });

    const payments = data.map((data) => ({
      ...data,
      ...data.user,
    }));
    return payments;
  }
}

export default PaymentRepository;
