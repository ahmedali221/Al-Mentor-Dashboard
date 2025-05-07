export interface UserSubscriptions {
  _id?: string; // Add _id field
  userId: string;
  user?: string; // Add user field
  subscriptionId: string;
  subscription?: {
    _id: string;
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
      currency: string;
    };
    duration: {
      value: number;
      unit: string;
    };
    trialPeriod?: {
      enabled: boolean;
      durationDays?: number;
    };
    isActive: boolean;
    priority: number;
  }; // Add subscription property
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'canceled';
  notifications?: {
    renewalWarning?: {
      sent: boolean;
      sentAt?: Date;
    };
    expiredNotice?: {
      sent: boolean;
      sentAt?: Date;
    };
  };
  isValid?: boolean; // Derived property
  createdAt?: Date; // Add createdAt field
  updatedAt?: Date; // Add updatedAt field
}
