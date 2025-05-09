export interface Topic {
  title: any;
  _id?: string;

  name: {
    en: string;
    ar?: string;
  };
  slug: {
    en: string;
    ar?: string;
  };
  description: {
    en: string;
    ar?: string;
  };
  thumbnailImgUrl: string;
  availableLanguages: string[];
  order: number;
  courseCount: number;
  createdAt?: string;
  updatedAt?: string;
  category: string;
}
