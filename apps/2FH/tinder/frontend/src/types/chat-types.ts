export interface MatchedUser {
  id: string;
  userId: string;
  name: string;
  work: string;
  images: string[];
  dateOfBirth: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    email?: string;
  } | null;
  receiver?: {
    id: string;
    email?: string;
  } | null;
} 