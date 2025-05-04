export interface Category {
    _id?: string;

    name: {
      en: string;
      ar?: string; 
    };
  
    description: {
      en: string;
      ar?: string;
    };
  
    thumbnailImgUrl: string;
  
    topics: string[];      
    subTopics: string[];   
    courses: string[];
    order: number;
  
    createdAt?: string;   
    updatedAt?: string;
}
