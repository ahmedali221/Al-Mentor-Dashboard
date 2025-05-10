import { Course } from "./course";
import { MultilingualString } from "./multilingual-string.interface";

export interface program {
    _id: string;
    title: MultilingualString;
    slug: string;
    description: MultilingualString;
    thumbnail: string;
    level: MultilingualString;
    language: string;
    totalDuration: number;
    courses: Course[];
    learningOutcomes: string[];
    category: MultilingualString;
    coursesDetails: string[];
}












