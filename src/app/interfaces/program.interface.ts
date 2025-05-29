import { Course } from "./course";
import { MultilingualString } from "./multilingual-string.interface";

export interface Program {
    _id: string;
    title: MultilingualString;
    slug: MultilingualString; // Changed to MultilingualString
    description: MultilingualString;
    thumbnail: string;
    level: MultilingualString;
    language: "ar" | "en";
    totalDuration: number;
    courses: string[]; // Array of Course ObjectIDs
    learningOutcomes: MultilingualString[]; // Array of MultilingualString objects
    category: MultilingualString;
    courseDetails?: Course[]; // Optional, when populated
}