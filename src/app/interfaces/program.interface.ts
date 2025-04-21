import { Instructor } from "./instructor.interface";

export interface program {
    title: string,
    slug: string,
    description: string,
    thumbnail: string,
    level: string,
    category: string,
    language: string,
    totalduration: number,
    instructors: Instructor[],
    learningOutcomes: string[]
}