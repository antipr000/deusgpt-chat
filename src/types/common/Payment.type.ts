export const Plan = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
};

export const PaymentStatus = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILURE: 'failure',
  CANCELLED: 'cancelled',
};

export type Payment = {
  firebaseId: string;
  paymentId: string;
  status: string;
  plan: string;
  amount: number;
  sessionId: string;
  invoiceId: string;
  createdAt: Date;
  completedAt: Date;
};

export type PaymentWithUser = Payment & {
  email: string;
  firstName: string;
  lastName: string;
};
