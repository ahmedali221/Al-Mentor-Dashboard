import { Course } from './course';

export interface Program {
    _id: string;
    title: {
        en: string;
        ar: string;
    };
    slug: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    level: {
        en: string;
        ar: string;
    };
    category: {
        en: string;
        ar: string;
    };
    thumbnail: string;
    language: string;
    totalDuration: number;
    courses: string[];
    courseDetails: Course[];
    learningOutcomes: {
        _id: string;
        id: string;
        en: string;
        ar: string;
        default: any[];
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}












