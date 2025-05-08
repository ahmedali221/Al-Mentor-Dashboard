export interface Payment {
  _id?: string;
  user: string | { _id: string; username: string };
  subscription: string | { _id: string; name: string };
  amount: number;
  currency?: string;
  transactionId: string;
  status?: string | { en: string; ar: string };
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}