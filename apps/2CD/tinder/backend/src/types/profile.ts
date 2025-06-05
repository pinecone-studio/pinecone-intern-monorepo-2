export interface CreateProfileInput {
  userId: string;
  firstName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lookingFor: 'Male' | 'Female' | 'Both';
  bio: string;
  interests: string[];
  profession: string;
  education: string;
  images: string[];
  isCertified: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface CreateProfileArgs {
  input: CreateProfileInput;
}

export interface UpdateProfileInput {
  bio?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  lookingFor?: 'Male' | 'Female' | 'Both';
  interests?: string[];
  profession?: string;
  education?: string;
  isCertified?: boolean;
  images?: string[];
}

export interface UpdateProfileArgs {
  id: string;
  input: UpdateProfileInput;
}