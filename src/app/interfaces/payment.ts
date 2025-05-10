import { MultilingualString } from './multilingual-string.interface';
import { Subscription } from './subscriptions';
import { User } from './user.interface';

export interface Payment {
  _id: string;
  user: User; // ObjectId reference to User
  subscription: Subscription; // ObjectId reference to Subscription
  amount: number;
  currency?: "USD" | "EGP";
  transactionId: string;
  status: MultilingualString; // Use MultilingualString for status
  paymentMethod: "credit_card" | "paypal" | "bank_transfer";
  createdAt?: string;
  updatedAt?: string;
}