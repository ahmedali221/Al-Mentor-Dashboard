import { MultilingualString } from "./multilingual-string.interface";

interface Profile {
  firstName: MultilingualString;
  lastName: MultilingualString;
  email: string;
  profilePicture: string;
}

export interface Instructor {
  name: MultilingualString;
  _id: string;
  user: string;
  professionalTitle: MultilingualString;
  expertiseAreas: { en: string[]; ar?: string[] };
  biography: MultilingualString;
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  yearsOfExperience?: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  profile: Profile;
}