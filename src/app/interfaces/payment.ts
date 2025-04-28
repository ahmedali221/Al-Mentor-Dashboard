export interface Payment {
    _id?: string;
    user: string | { _id: string; username: string }; // Adapt as per population
    subscription: string | { _id: string; name: string }; // Adapt as per population
    amount: number;
    currency?: string;
    transactionId: string;
    status?: string | { en: string; ar: string };
    paymentMethod?: string;
    createdAt?: string;
    updatedAt?: string;
  }