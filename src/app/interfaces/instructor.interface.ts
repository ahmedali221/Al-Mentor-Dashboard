interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface Instructor {
  user: string;
  professionalTitle: string;
  expertiseAreas: string[];
  biography: string;
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  yearsOfExperience?: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  profile?: Profile;
}