import { Types } from 'mongoose';

export const mockUsers = [
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test User 1',
    email: 'test1@example.com',
    toObject: () => ({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User 1',
      email: 'test1@example.com',
    }),
  },
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Test User 2',
    email: 'test2@example.com',
    toObject: () => ({
      _id: '507f1f77bcf86cd799439012',
      name: 'Test User 2',
      email: 'test2@example.com',
    }),
  },
];

export const mockProfiles = [
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
    userId: mockUsers[0]._id,
    bio: 'Test Bio 1',
    age: 25
  },
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439014'),
    userId: mockUsers[1]._id,
    bio: 'Test Bio 2',
    age: 26
  },
];

export const mockMatches = [
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439015'),
    users: [mockUsers[0], mockUsers[1]]
  },
];

export const mockLikesFrom = [
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439016'),
    sender: mockUsers[0]._id,
    receiver: mockUsers[1]._id
  },
];

export const mockLikesTo = [
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439017'),
    sender: mockUsers[1]._id,
    receiver: mockUsers[0]._id
  },
];

export const mockMessages = [
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439018'),
    sender: mockUsers[0]._id,
    content: 'Hello'
  },
  { 
    _id: new Types.ObjectId('507f1f77bcf86cd799439019'),
    sender: mockUsers[1]._id,
    content: 'Hi'
  },
]; 