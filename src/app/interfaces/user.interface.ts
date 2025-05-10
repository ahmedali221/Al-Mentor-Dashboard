import { MultilingualString } from './multilingual-string.interface';

export interface User {
  name: MultilingualString;
  _id: string;

  username: string;
  email: string;
  password?: string;
  firstName: MultilingualString;
  lastName: MultilingualString;
  profilePicture?: string;
}