
import { MultilingualString } from './multilingual-string.interface';

export interface Course {
  courseCount: number;
  instructor: string;
  topic: string;
  isFree: boolean;
  duration: number;
  language: string;
  level: string;
  lessonsCount: number;
  name: any;
  _id: string;
  status: string;
  title: MultilingualString;
  description: MultilingualString;
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

export interface TableColumn {
  prop: string;
  name: string;
  getValue?: (course: Course) => string | number | undefined | null;
}