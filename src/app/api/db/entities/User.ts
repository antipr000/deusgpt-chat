import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  plan: {
    type: String,
    required: false,
    default: 'standard',
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  planExpiry: {
    type: Date,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  subscriptionPaymentFailure: {
    type: Boolean,
    default: false,
    required: false,
  },
});

// Take from already created schema if present, otherwise errors on hot reloading
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export { UserModel };
