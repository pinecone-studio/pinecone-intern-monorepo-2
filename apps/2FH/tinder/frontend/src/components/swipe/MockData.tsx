export interface Profile {
  id: string;
  userId: string;
  name: string;
  gender: 'male' | 'female' | 'both';
  bio: string;
  interests: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: string[];
  matches?: string[];
}

export const mockProfiles: Profile[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'John Doe',
    gender: 'male',
    bio: 'Loves hiking and coding',
    interests: ['hiking', 'coding', 'music'],
    profession: 'Software Engineer',
    work: 'Tech Corp',
    images: ['image1.jpg', 'image2.jpg'],
    dateOfBirth: '1990-01-01',
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Jane Smith',
    gender: 'female',
    bio: 'Avid reader and traveler',
    interests: ['reading', 'traveling'],
    profession: 'Writer',
    work: 'Freelance',
    images: ['image3.jpg'],
    dateOfBirth: '1992-05-10',
  },
  {
    id: '3',
    userId: 'user3',
    name: 'Mike Johnson',
    gender: 'male',
    bio: 'Fitness enthusiast',
    interests: ['gym', 'running'],
    profession: 'Personal Trainer',
    work: 'FitGym',
    images: ['image4.jpg'],
    dateOfBirth: '1988-03-15',
  },
  {
    id: '4',
    userId: 'user4',
    name: 'Alex Lee',
    gender: 'both',
    bio: 'Open to all experiences',
    interests: ['music', 'art'],
    profession: 'Artist',
    work: 'Freelance',
    images: ['image5.jpg'],
    dateOfBirth: '1995-07-20',
  },
];