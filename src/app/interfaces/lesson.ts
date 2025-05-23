export interface Lesson {
  availableLanguages: any;
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  module?: string;
  description?: {
    en?: string;
    ar?: string;
  };
  courseId?: string; // لو شغال بـ ID فقط
  course?: {
    _id: string;
    title: {
      en: string;
      ar?: string;
    };
  };
  order: number;
  duration?: number;
  content?: {
    videoUrl?: string;
    articleText?: {
      en?: string;
      ar?: string;
    };
    attachments?: {
      name: {
        en: string;
        ar: string;
      };
      url: string;
      type: "pdf" | "slide" | "audio";
    }[];
  };
  isFree?: boolean;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // courseId?: string; 
  courseName?: string; 
  status?: string; 
}