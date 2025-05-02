export interface CategoryInterface {
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
  
    order: number;
  
    createdAt?: string;   
    updatedAt?: string;
}
