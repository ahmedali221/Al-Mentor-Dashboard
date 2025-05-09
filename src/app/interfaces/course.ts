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
  topic: string; 
  subtopic?: string; 
  instructor: string; 
  category: string; 
  

  description: {
    en: string;
    ar: string;
  };
  shortDescription?: {
    en?: string;
    ar?: string;
  };
  modules?: string[]; 
  freeLessons?: {
    lessonId: string;
    title: string;
    duration: number;
  }[];
  
  
  level: {
    en: 'beginner' | 'intermediate' | 'advanced';
    ar: 'مبتدئ' | 'متوسط' | 'متقدم';
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
    user: string;
    expertiseAreas: any;
    profile: any;
  };
  
  status?: string;
  thumbnailImgUrl?: string;
  availableLanguages?: string[];
  order?: number;
  isPublished?: boolean;
  instructorName?: string;
  lessonsCount?: number;
  courseCount?: number;
  topicId?: string;
}

export interface TableColumn {
  prop: string;
  name: string;
  getValue?: (course: Course) => string | number | undefined | null;
}
