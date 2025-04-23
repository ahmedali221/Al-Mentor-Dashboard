import { Course } from "./course";

// ... existing code ...
export interface program {
    _id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    level: "beginner" | "intermediate" | "advanced";
    language: string;
    totalDuration: number;
    courses: Course[];
    learningOutcomes: string[];
    category: "language" | "business" | "development";
    coursesDetails: string[]

}












