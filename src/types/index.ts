export enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  USER = "USER",
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  organization?: string;
}
