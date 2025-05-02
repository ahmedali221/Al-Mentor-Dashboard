// export interface Course {
//   courseCount: number;
//   instructor: string | null | undefined;
//   topic: string | null | undefined;
//   isFree: boolean | null | undefined;
//   duration: number | null | undefined;
//   language: string | null | undefined;
//   level: string | null | undefined;
//   lessonsCount: number;
//   name: any;
//   _id: string;
//   status: string;
//   title: {
//     en: string;
//     ar?: string;
//   };
//   description: {
//     en: string;
//     ar?: string;
//   };
//   slug: string;
//   topicId: string;
//   thumbnailImgUrl?: string;
//   availableLanguages: string[];
//   order: number;
//   isPublished: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   instructorName: string;

// }

// Interface for Course data model
export interface Course {
  courseCount: number;
  instructor: string ;
  topic: string ;
  isFree: boolean ;
  duration: number;
  language: string ;
  level: string ;
  lessonsCount: number;
  name: any;
  _id: string;
  status: string;
  title: {
    en: string;
    ar?: string;
  };
  description: {
    en: string;
    ar?: string;
  };
  slug: string;
  topicId: string;
  thumbnailImgUrl?: string;
  availableLanguages: string[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructorName: string;
}

// Define column interface for dynamic table rendering
export interface TableColumn {
  prop: string;
  name: string;
  getValue?: (course: Course) => string | number | undefined | null;
}