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


export interface AuthState {
    user : User | null; 
    loading : boolean ;
    error : string |null ;
}

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  organizerId: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  venue?: string;
};
export interface EventFilters {
  search?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}