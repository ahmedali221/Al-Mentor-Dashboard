export interface User {
  name: string;
  _id: string;

  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}