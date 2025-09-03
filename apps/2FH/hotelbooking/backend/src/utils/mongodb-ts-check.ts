import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';

// MongoDB холболт эхлүүлэх
const connectToMongoDB = async () => {
  try {
    console.log('🔌 MongoDB холболт эхлүүлж байна...');
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB холбогдсон байна');
      return true;
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable тогтоогдоогүй байна');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB холболт амжилттай');
    return true;

  } catch (error) {
    console.error('❌ MongoDB холболт амжилтгүй:', error);
    return false;
  }
};

// MongoDB шалгах функц
export const checkMongoDBStatus = async () => {
  try {
    console.log('🔍 MongoDB статус шалгаж байна...\n');

    // 1. Environment variables шалгах
    console.log('1. Environment variables шалгаж байна...');
    const mongoUri = process.env.MONGO_URI;
    console.log('MONGO_URI:', mongoUri ? 'Тогтоосон' : 'Тогтоогдоогүй');

    if (!mongoUri) {
      return {
        success: false,
        issue: 'MONGO_URI байхгүй',
        message: 'MONGO_URI environment variable тогтоогдоогүй байна'
      };
    }

    // 2. Database холболт эхлүүлэх
    console.log('\n2. Database холболт эхлүүлж байна...');
    const connected = await connectToMongoDB();
    
    if (!connected) {
      return {
        success: false,
        issue: 'Database холбогдоогүй',
        message: 'Database холбогдохгүй байна'
      };
    }

    // 3. Database холболт шалгах
    console.log('\n3. Database холболт шалгаж байна...');
    const connectionState = mongoose.connection.readyState;
    const stateNames: Record<number, string> = {
      0: 'холбогдоогүй',
      1: 'холбогдсон',
      2: 'холбогдож байна',
      3: 'холболт тасарч байна'
    };

    console.log('Холболтын төлөв:', stateNames[connectionState] || 'үл мэдэгдэх');

    if (connectionState !== 1) {
      return {
        success: false,
        issue: 'Database холбогдоогүй',
        message: 'Database холбогдоогүй байна',
        connectionState: stateNames[connectionState] || 'үл мэдэгдэх'
      };
    }

    console.log('✅ Database холбогдсон');

    // 4. Database мэдээлэл
    console.log('\n4. Database мэдээлэл...');
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;

    console.log('Database нэр:', dbName);
    console.log('Host:', host);
    console.log('Port:', port);

    // 5. Collections шалгах
    console.log('\n5. Collections шалгаж байна...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Боломжтой collections:', collections.map(col => col.name));

    // 6. Users collection шалгах
    console.log('\n6. Users collection шалгаж байна...');
    const userCount = await UserModel.countDocuments();
    console.log('Хэрэглэгчдийн тоо:', userCount);

    if (userCount === 0) {
      console.log('⚠️ Database дээр хэрэглэгч олдсонгүй');
    } else {
      const sampleUsers = await UserModel.find({}).limit(3);
      console.log('Жишээ хэрэглэгчид:', sampleUsers.map(user => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth
      })));
    }

    return {
      success: true,
      message: 'MongoDB зөв ажиллаж байна',
      databaseInfo: {
        name: dbName,
        host,
        port,
        collections: collections.map(col => col.name)
      },
      userCount
    };

  } catch (error) {
    console.error('❌ MongoDB шалгалт амжилтгүй:', error);
    return {
      success: false,
      issue: 'Алдаа',
      message: `Алдаа: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Хэрэглэгч үүсгэх тест
export const testUserCreation = async () => {
  try {
    console.log('🧪 Хэрэглэгч үүсгэх тест...\n');

    // Холболт шалгах
    if (mongoose.connection.readyState !== 1) {
      await connectToMongoDB();
    }

    const testUser = new UserModel({
      email: 'test.mongodb@example.com',
      password: 'password123',
      role: 'user',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: new Date('1990-01-01')
    });

    const savedUser = await testUser.save();
    console.log('✅ Тест хэрэглэгч үүсгэгдлээ:', {
      _id: savedUser._id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName
    });

    // Тест хэрэглэгчийг устгах
    await UserModel.deleteOne({ _id: savedUser._id });
    console.log('Тест хэрэглэгч устгагдлаа');

    return {
      success: true,
      message: 'Хэрэглэгч үүсгэх тест амжилттай'
    };

  } catch (error) {
    console.error('❌ Хэрэглэгч үүсгэх тест амжилтгүй:', error);
    return {
      success: false,
      message: `Тест амжилтгүй: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Хэрэглэгч шинэчлэх тест
export const testUserUpdate = async () => {
  try {
    console.log('🔄 Хэрэглэгч шинэчлэх тест...\n');

    // Холболт шалгах
    if (mongoose.connection.readyState !== 1) {
      await connectToMongoDB();
    }

    // Эхлээд тест хэрэглэгч үүсгэх
    const testUser = new UserModel({
      email: 'update.test@example.com',
      password: 'password123',
      role: 'user'
    });

    const savedUser = await testUser.save();
    console.log('Тест хэрэглэгч үүсгэгдлээ:', savedUser._id);

    // Хэрэглэгчийг шинэчлэх
    const updatedUser = await UserModel.findByIdAndUpdate(
      savedUser._id,
      { 
        $set: { 
          firstName: 'Updated',
          lastName: 'User',
          dateOfBirth: new Date('1995-05-15')
        } 
      },
      { new: true }
    );

    console.log('✅ Хэрэглэгч шинэчлэгдлээ:', {
      firstName: updatedUser?.firstName,
      lastName: updatedUser?.lastName,
      dateOfBirth: updatedUser?.dateOfBirth
    });

    // Тест хэрэглэгчийг устгах
    await UserModel.deleteOne({ _id: savedUser._id });
    console.log('Тест хэрэглэгч устгагдлаа');

    return {
      success: true,
      message: 'Хэрэглэгч шинэчлэх тест амжилттай'
    };

  } catch (error) {
    console.error('❌ Хэрэглэгч шинэчлэх тест амжилтгүй:', error);
    return {
      success: false,
      message: `Тест амжилтгүй: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Бүх тестүүдийг ажиллуулах
export const runAllMongoDBTests = async () => {
  try {
    console.log('🚀 Бүх MongoDB тестүүдийг ажиллуулж байна...\n');

    const results = {
      status: await checkMongoDBStatus(),
      userCreation: await testUserCreation(),
      userUpdate: await testUserUpdate()
    };

    console.log('\n=== ТЕСТИЙН ДҮН ===');
    console.log(JSON.stringify(results, null, 2));

    const allSuccess = results.status.success && 
                     results.userCreation.success && 
                     results.userUpdate.success;

    if (allSuccess) {
      console.log('\n✅ Бүх тестүүд амжилттай!');
    } else {
      console.log('\n❌ Зарим тестүүд амжилтгүй:');
      Object.entries(results).forEach(([test, result]) => {
        if (!result.success) {
          console.log(`- ${test}: ${result.message}`);
        }
      });
    }

    return results;

  } catch (error) {
    console.error('❌ Тестүүд амжилтгүй:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
