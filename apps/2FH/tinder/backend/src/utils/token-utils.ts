import jwt from 'jsonwebtoken';
import { User } from 'src/models';

export interface TokenPayload {
  userId: string;
}

export interface MockUserData {
  id: string;
  email: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  interests: string[];
}

// Token-ийг verify хийх функц
export function verifyToken(token: string): TokenPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET тохируулаагүй байна');
      return null;
    }
    
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verify хийхэд алдаа гарлаа:', error);
    return null;
  }
}

// Token-оос хэрэглэгчийн ID-г авах
export function getUserIdFromToken(token: string): string | null {
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// Token-оос хэрэглэгчийн мэдээллийг авах
export async function getUserFromToken(token: string) {
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return null;
  }
  
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа:', error);
    return null;
  }
}

// Mock data үүсгэх функц
export function generateMockUserData(userId: string): MockUserData {
  const mockNames = ['Бат', 'Болд', 'Төгс', 'Мөнх', 'Энх', 'Сүхээ', 'Батбаяр', 'Дэлгэр'];
  const mockBios = [
    'Аялалд дуртай, шинэ зүйл судлах хүсэлтэй',
    'Спорт болон фитнес хийх дуртай',
    'Уран зохиол уншиж, кино үзэх дуртай',
    'Хөгжим сонсох, гитар тоглох дуртай',
    'Хоол хийх, хоолны жор судлах дуртай'
  ];
  const mockInterests = [
    ['Аялал', 'Спорт', 'Хөгжим'],
    ['Кино', 'Ном', 'Уран зохиол'],
    ['Хоол', 'Кофе', 'Ресторан'],
    ['Фитнес', 'Йога', 'Медитаци'],
    ['Технологи', 'Програмчлал', 'Шинэ зүйл']
  ];
  
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
  const randomBio = mockBios[Math.floor(Math.random() * mockBios.length)];
  const randomInterests = mockInterests[Math.floor(Math.random() * mockInterests.length)];
  
  return {
    id: userId,
    email: `mock_${userId}@example.com`,
    name: randomName,
    age: Math.floor(Math.random() * 20) + 20, // 20-40 нас
    bio: randomBio,
    photos: [
      `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`
    ],
    location: 'Улаанбаатар',
    interests: randomInterests
  };
}

// Token-оос mock data үүсгэх
export function getMockDataFromToken(token: string): MockUserData | null {
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return null;
  }
  
  return generateMockUserData(userId);
}
