export interface Course {
  _id: string;

  title: {
    en: string;
    ar: string;
  };

  slug: {
    en: string;
    ar: string;
  };

  topic: string;      // ObjectId string referring to Topic
  subtopic?: string;  // ObjectId string referring to SubTopic
  instructor: string; // ObjectId string referring to Instructor
  category: string;   // ObjectId string referring to Category

  thumbnail: string; // URL string, validated in schema

  description: {
    en: string;
    ar: string;
  };

  shortDescription?: {
    en?: string;
    ar?: string;
  };

  modules?: string[]; // Array of ObjectId strings referring to Modules

  freeLessons?: {
    lessonId: string; // ObjectId string referring to Lesson
    title: string;
    duration: number;
  }[];

  level: {
    en: 'beginner' | 'intermediate' | 'advanced';
    ar: 'مبتدئ' | 'متوسط' | 'متقدم';
  };

  language: {
    en: 'English' | 'Arabic' | 'French';
    ar: 'الإنجليزية' | 'العربية' | 'الفرنسية';
  };

  duration: number;

  lastUpdated: Date;

  enrollmentCount: number;

  isFree: boolean;

  rating: {
    average: number;
    count: number;
  };

  createdAt: Date;
  updatedAt: Date;

  instructorDetails?: {
    user: string | any;           // User reference or object (type as available)
    expertiseAreas: any;          // You can specify if you have a tighter interface
    profile: any;                 // Full populated profile object (type as available)
  };
}

export interface TableColumn {
  prop: string;
  name: string;
  getValue?: (course: Course) => string | number | undefined | null;
}