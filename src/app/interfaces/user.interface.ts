export interface User {
  username: string;
  email: string;
  password?: string;
  role: 'student' | 'instructor';
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}