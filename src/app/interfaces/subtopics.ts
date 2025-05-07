
export interface Subtopics {
  _id?: string;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  topic: string;
  description?: {
    en?: string;
    ar?: string;
  };
  thumbnailImgUrl?: string;
  order: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
