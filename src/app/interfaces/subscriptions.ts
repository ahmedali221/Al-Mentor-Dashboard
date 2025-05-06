// interfaces/subscription.interface.ts
export interface Subscription {
    _id?: string;
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
      originalAmount?: number;
      currency: string;
    };
    duration: {
      value: number;
      unit: string;
    };
    trialPeriod?: {
      enabled?: boolean;
      durationDays?: number;
    };
    features: Array<{
      title: { en: string; ar: string };
      description: { en: string; ar: string };
      icon?: string;
    }>;
    isActive: boolean;
    priority: number;
  }