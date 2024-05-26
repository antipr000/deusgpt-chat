import mongoose from 'mongoose';

import { Payment, PaymentStatus, Plan } from '@/types/common/Payment.type';

const paymentSchema = new mongoose.Schema<Payment>({
  firebaseId: {
    type: String,
    required: true,
    trim: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: PaymentStatus.PENDING,
    enum: Object.values(PaymentStatus),
  },
  plan: {
    type: String,
    required: true,
    enum: Object.values(Plan),
  },
  amount: {
    type: Number,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    required: false,
  },
});

// Take from already created schema if present, otherwise errors on hot reloading
const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export { PaymentModel };
