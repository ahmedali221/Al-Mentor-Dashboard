export interface Topic {
  _id?: string;

  name: {
    en: string;
    ar?: string; 
  };
  slug: string;
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
}
