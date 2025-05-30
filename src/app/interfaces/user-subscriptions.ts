export interface UserSubscriptions {
  _id: string;
  userId: {
    _id: string;
    firstName: {
      en: string;
      ar: string;
    };
    lastName: {
      en: string;
      ar: string;
    };
    email: string;
  };
  subscriptionId: {
    _id: string;
    name: string;
    displayName: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
    price: {
      amount: number;
      originalAmount: number | null;
      currency: string;
    };
    duration: {
      value: number;
      unit: string;
    };
    trialPeriod: {
      enabled: boolean;
      durationDays: number | null;
    };
    isActive: boolean;
    priority: number;
    features: any[];
  };
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'canceled';
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}
