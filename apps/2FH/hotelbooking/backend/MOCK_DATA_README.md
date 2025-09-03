# Mock Data Seeder - Зочид буудал захиалгын систем

Энэ систем нь зочид буудал захиалгын системийн MongoDB өгөгдлийн сангад бодит mock data үүсгэхэд зориулагдсан.

## 🚀 Хэрэглээ

### Nx командуудаар ашиглах

```bash
# Бүх mock data үүсгэх
nx run hotelbooking-2fh-backend:seed:all

# Зөвхөн хэрэглэгчид үүсгэх
nx run hotelbooking-2fh-backend:seed:users

# Зөвхөн зочид буудлууд үүсгэх
nx run hotelbooking-2fh-backend:seed:hotels

# Өгөгдлийн статистик харуулах
nx run hotelbooking-2fh-backend:seed:stats

# Бүх өгөгдлийг устгах
nx run hotelbooking-2fh-backend:seed:clear
```

### Шууд скрипт ашиглах

```bash
# Бүх mock data үүсгэх
tsx src/utils/seed-script.ts all

# Зөвхөн хэрэглэгчид үүсгэх
tsx src/utils/seed-script.ts users

# Зөвхөн зочид буудлууд үүсгэх
tsx src/utils/seed-script.ts hotels

# Өгөгдлийн статистик харуулах
tsx src/utils/seed-script.ts stats

# Бүх өгөгдлийг устгах
tsx src/utils/seed-script.ts clear

# Тусламж харуулах
tsx src/utils/seed-script.ts help
```

## 📊 Үүсгэгдэх өгөгдлүүд

### 👥 Хэрэглэгчид (5 хэрэглэгч)
- **John Doe** - `john.doe@example.com` (user)
- **Jane Smith** - `jane.smith@example.com` (user)
- **Admin User** - `admin@hotelbooking.com` (admin)
- **Mike Wilson** - `mike.wilson@example.com` (user)
- **Sarah Johnson** - `sarah.johnson@example.com` (user)

### 🏨 Зочид буудлууд (3 зочид буудал)
1. **Grand Plaza Hotel** - 5 одтой, New York
2. **Seaside Resort & Spa** - 4 одтой, Miami
3. **Mountain View Lodge** - 3 одтой, Denver

### 🛏️ Өрөөнүүд (12 өрөө)
Хэрэглэгч бүрт 4 төрлийн өрөө:
- **Standard Room** - Нэг хүний өрөө
- **Deluxe Room** - Хоёр хүний өрөө
- **Suite** - Люкс өрөө
- **Family Room** - Гэр бүлийн өрөө

### 📅 Захиалгууд (5 захиалга)
Хэрэглэгч бүрт нэг захиалга:
- Ирээдүйн захиалгууд (booked)
- Дууссан захиалгууд (completed)
- Цуцлагдсан захиалгууд (cancelled)

## 🔧 Тохиргоо

### Environment Variables
```bash
MONGO_URI=mongodb://localhost:27017/your-database
```

### Өгөгдлийн бүтэц

#### User Model
```typescript
{
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}
```

#### Hotel Model
```typescript
{
  name: string;
  description: string;
  images: string[];
  stars: number;
  phone: string;
  rating: number;
  city: string;
  country: string;
  location: string;
  amenities: string[];
  languages: string[];
  policies: Policy[];
  optionalExtras: OptionalExtra[];
  faq: FAQ[];
}
```

#### Room Model
```typescript
{
  hotelId: ObjectId;
  name: string;
  images: string[];
  pricePerNight: number;
  typePerson: 'single' | 'double' | 'triple';
  roomInformation: string[];
  bathroom: string[];
  accessibility: string[];
  internet: string[];
  foodAndDrink: string[];
  bedRoom: string[];
  other: string[];
  entertainment: string[];
  bedNumber: number;
}
```

#### Booking Model
```typescript
{
  userId: ObjectId;
  hotelId: ObjectId;
  roomId: ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  status: 'booked' | 'completed' | 'cancelled';
}
```

## 🧪 Тест

Mock data seeder-ийн тестүүдийг ажиллуулах:

```bash
# Бүх тестүүдийг ажиллуулах
nx test hotelbooking-2fh-backend

# Зөвхөн mock data seeder тестүүд
nx test hotelbooking-2fh-backend --testPathPattern=mock-data-seeder.spec.ts
```

## ⚠️ Анхааруулга

1. **Өгөгдөл устгах**: Seeder нь одоогийн өгөгдлийг устгаж, шинэ mock data үүсгэнэ
2. **Production**: Энэ системийг зөвхөн development болон testing орчинд ашиглана
3. **Backup**: Чухал өгөгдөл байвал backup хийгээрэй

## 🔄 Функцүүд

### `seedMockData()`
Бүх mock data үүсгэнэ (хэрэглэгчид, зочид буудлууд, өрөөнүүд, захиалгууд)

### `seedUsersOnly()`
Зөвхөн хэрэглэгчид үүсгэнэ

### `seedHotelsOnly()`
Зөвхөн зочид буудлууд үүсгэнэ

### `getSeedingStats()`
Одоогийн өгөгдлийн статистик буцаана

### `clearAllData()`
Бүх өгөгдлийг устгана

## 📝 Жишээ

```typescript
import { seedMockData, getSeedingStats } from './utils/mock-data-seeder';

// Бүх mock data үүсгэх
const result = await seedMockData();
if (result.success) {
  console.log('Mock data үүсгэгдлээ:', result.summary);
}

// Статистик харуулах
const stats = await getSeedingStats();
console.log('Одоогийн өгөгдөл:', stats);
```

## 🐛 Алдааны шийдэл

### MongoDB холболт амжилтгүй
```bash
# MONGO_URI шалгах
echo $MONGO_URI

# MongoDB сервер ажиллаж байгаа эсэхийг шалгах
mongosh
```

### Өгөгдөл үүсгэх амжилтгүй
```bash
# Өгөгдлийн сангийн эрх шалгах
# MongoDB connection string зөв эсэхийг шалгах
# Network холболт шалгах
```

## 📞 Тусламж

Асуулт эсвэл асуудал гарвал:
1. Тестүүдийг ажиллуулж үзээрэй
2. MongoDB холболтыг шалгаарай
3. Environment variables зөв тогтоогдсон эсэхийг шалгаарай
4. Console log-уудыг шалгаарай




