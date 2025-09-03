#!/usr/bin/env node

import { seedMockData, seedUsersOnly, seedHotelsOnly, getSeedingStats, clearAllData } from './mock-data-seeder';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    console.log('🚀 Mock Data Seeder Script\n');

    switch (command) {
      case 'seed':
      case 'all':
        console.log('🌱 Бүх mock data үүсгэж байна...');
        const result = await seedMockData();
        if (result.success) {
          console.log('\n✅ Амжилттай!');
          console.log('📊 Дүн:');
          console.log(`   👥 Хэрэглэгчид: ${result.summary?.users}`);
          console.log(`   🏨 Зочид буудлууд: ${result.summary?.hotels}`);
          console.log(`   🛏️ Өрөөнүүд: ${result.summary?.rooms}`);
          console.log(`   📅 Захиалгууд: ${result.summary?.bookings}`);
        } else {
          console.log('\n❌ Амжилтгүй:', result.message);
          process.exit(1);
        }
        break;

      case 'users':
        console.log('👥 Зөвхөн хэрэглэгчид үүсгэж байна...');
        const userResult = await seedUsersOnly();
        if (userResult.success) {
          console.log(`\n✅ ${userResult.count} хэрэглэгч үүсгэгдлээ`);
        } else {
          console.log('\n❌ Амжилтгүй:', userResult.error);
          process.exit(1);
        }
        break;

      case 'hotels':
        console.log('🏨 Зөвхөн зочид буудлууд үүсгэж байна...');
        const hotelResult = await seedHotelsOnly();
        if (hotelResult.success) {
          console.log(`\n✅ ${hotelResult.count} зочид буудал үүсгэгдлээ`);
        } else {
          console.log('\n❌ Амжилтгүй:', hotelResult.error);
          process.exit(1);
        }
        break;

      case 'stats':
        console.log('📊 Өгөгдлийн статистик...');
        const stats = await getSeedingStats();
        if (stats) {
          console.log('\n📈 Одоогийн өгөгдөл:');
          console.log(`   👥 Хэрэглэгчид: ${stats.users}`);
          console.log(`   🏨 Зочид буудлууд: ${stats.hotels}`);
          console.log(`   🛏️ Өрөөнүүд: ${stats.rooms}`);
          console.log(`   📅 Захиалгууд: ${stats.bookings}`);
        } else {
          console.log('\n❌ Статистик авах амжилтгүй');
          process.exit(1);
        }
        break;

      case 'clear':
        console.log('🧹 Бүх өгөгдлийг устгаж байна...');
        const clearResult = await clearAllData();
        if (clearResult.success) {
          console.log('\n✅ Бүх өгөгдөл устгагдлаа');
        } else {
          console.log('\n❌ Амжилтгүй:', clearResult.error);
          process.exit(1);
        }
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        console.log('❌ Буруу команда');
        showHelp();
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Алдаа:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
📖 Mock Data Seeder - Тусламж

Хэрэглээ:
  npm run seed [команда]

Командууд:
  seed, all     - Бүх mock data үүсгэх (хэрэглэгчид, зочид буудлууд, өрөөнүүд, захиалгууд)
  users         - Зөвхөн хэрэглэгчид үүсгэх
  hotels        - Зөвхөн зочид буудлууд үүсгэх
  stats         - Одоогийн өгөгдлийн статистик харуулах
  clear         - Бүх өгөгдлийг устгах
  help          - Энэ тусламжийг харуулах

Жишээ:
  npm run seed all
  npm run seed users
  npm run seed stats
  npm run seed clear

⚠️  Анхааруулга: Энэ скрипт нь одоогийн өгөгдлийг устгаж, шинэ mock data үүсгэнэ.
`);
}

// Run the script
main();




