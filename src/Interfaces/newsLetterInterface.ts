import { ObjectId } from "mongodb";

export interface NewsletterSubscriberType {
  _id?: string| ObjectId;         
  email: string;        
  subscribedAt?: string;    
  isActive: boolean;     
}

export type GetNewsLetterParams = {
  currentPage?: number;  
  limit?: number;
  searchTrim?: string;
};