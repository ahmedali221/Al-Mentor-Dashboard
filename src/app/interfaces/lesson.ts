export interface Lesson {
  status: string;
  availableLanguages: string[];
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  content: {
    articleText: {
      en: string;
      ar: string;
    };
    videoUrl: string;
    attachments: {
      name: {
        en: string;
        ar: string;
      };
      url: string;
      type: "pdf" | "slide" | "audio";
    }[];
  };
  module: {
    _id: string;
    title: {
      en: string;
      ar: string;
    };
    level: {
      en: string;
      ar: string;
    };
    course: string;
    order: number;
    duration: number;
    isPublished: boolean;
    completionCriteria: string;
    createdAt: string;
    updatedAt: string;
  };
  course: {
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
    shortDescription: {
      en: string;
      ar: string;
    };
    level: {
      en: string;
      ar: string;
    };
    language: {
      en: string;
      ar: string;
    };
    rating: {
      average: number;
      count: number;
    };
    instructor: {
      _id: string;
      professionalTitle: {
        en: string;
        ar: string;
      };
      expertiseAreas: {
        en: string[];
        ar: string[];
      };
      biography: {
        en: string;
        ar: string;
      };
      user: {
        _id: string;
        firstName: {
          en: string;
          ar: string;
        };
        lastName: {
          en: string;
          ar: string;
        };
        username: string;
        email: string;
        profilePicture: string;
      };
      socialMediaLinks: {
        linkedin: string;
        twitter: string;
        youtube: string;
        website: string;
      };
      yearsOfExperience: number;
      approvalStatus: string;
    };
    category: string;
    duration: number;
    enrollmentCount: number;
    isFree: boolean;
    thumbnail: string;
  };
  order: number;
  duration: number;
  isFree: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}