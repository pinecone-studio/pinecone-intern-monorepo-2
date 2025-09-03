import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { HotelModel } from '../models/hotel.model';
import { RoomModel } from '../models/room.model';
import { BookingModel } from '../models/booking.model';
import { EmergencyContactModel } from '../models/emergency-contact.model';

// Mock data for users
const mockUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user' as const,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15'
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'user' as const,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1988-12-03'
  },
  {
    email: 'admin@hotelbooking.com',
    password: 'admin123',
    role: 'admin' as const,
    firstName: 'Admin',
    lastName: 'User',
    dateOfBirth: '1985-01-01'
  },
  {
    email: 'mike.wilson@example.com',
    password: 'password123',
    role: 'user' as const,
    firstName: 'Mike',
    lastName: 'Wilson',
    dateOfBirth: '1992-08-22'
  },
  {
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'user' as const,
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1995-03-10'
  }
];

// Mock data for hotels
const mockHotels = [
  {
    name: 'Grand Plaza Hotel',
    description: 'Luxurious 5-star hotel in the heart of the city with stunning views and world-class amenities.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    stars: 5,
    phone: '+1-555-0123',
    rating: 4.8,
    city: 'New York',
    country: 'USA',
    location: 'Manhattan, NY',
    amenities: ['pool', 'gym', 'restaurant', 'bar', 'wifi', 'parking', 'spa', 'room_service'],
    languages: ['English', 'Spanish', 'French'],
    policies: [
      {
        checkIn: '3:00 PM',
        checkOut: '11:00 AM',
        specialCheckInInstructions: 'Please have a valid ID and credit card ready',
        accessMethods: ['Key card', 'Mobile app'],
        childrenAndExtraBeds: 'Children under 12 stay free with parents',
        pets: 'Pets allowed with additional fee'
      }
    ],
    optionalExtras: [
      {
        youNeedToKnow: 'Early check-in available upon request',
        weShouldMention: 'Complimentary breakfast included'
      }
    ],
    faq: [
      {
        question: 'Is parking available?',
        answer: 'Yes, we offer both valet and self-parking options'
      },
      {
        question: 'Do you have a pool?',
        answer: 'Yes, we have an indoor heated pool open year-round'
      }
    ]
  },
  {
    name: 'Seaside Resort & Spa',
    description: 'Beautiful beachfront resort with private beach access and tropical gardens.',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
    ],
    stars: 4,
    phone: '+1-555-0456',
    rating: 4.6,
    city: 'Miami',
    country: 'USA',
    location: 'Miami Beach, FL',
    amenities: ['pool', 'gym', 'restaurant', 'bar', 'wifi', 'parking', 'spa', 'pets_allowed'],
    languages: ['English', 'Spanish'],
    policies: [
      {
        checkIn: '4:00 PM',
        checkOut: '10:00 AM',
        specialCheckInInstructions: 'Beach towels provided at check-in',
        accessMethods: ['Key card'],
        childrenAndExtraBeds: 'Kids club available for children 4-12',
        pets: 'Pet-friendly resort with designated areas'
      }
    ],
    optionalExtras: [
      {
        youNeedToKnow: 'Beach chairs and umbrellas available for rent',
        weShouldMention: 'Daily housekeeping service included'
      }
    ],
    faq: [
      {
        question: 'Is the beach private?',
        answer: 'Yes, we have exclusive access to a private beach section'
      },
      {
        question: 'Are there water sports available?',
        answer: 'Yes, we offer various water sports activities'
      }
    ]
  },
  {
    name: 'Mountain View Lodge',
    description: 'Cozy mountain lodge with breathtaking views and outdoor activities.',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
    ],
    stars: 3,
    phone: '+1-555-0789',
    rating: 4.4,
    city: 'Denver',
    country: 'USA',
    location: 'Rocky Mountains, CO',
    amenities: ['wifi', 'parking', 'fitness_center', 'restaurant', 'free_wifi'],
    languages: ['English'],
    policies: [
      {
        checkIn: '2:00 PM',
        checkOut: '11:00 AM',
        specialCheckInInstructions: 'Weather-dependent access, check road conditions',
        accessMethods: ['Key card', 'Traditional key'],
        childrenAndExtraBeds: 'Family rooms available',
        pets: 'Pet-friendly with hiking trails nearby'
      }
    ],
    optionalExtras: [
      {
        youNeedToKnow: 'Guided hiking tours available',
        weShouldMention: 'Complimentary hot chocolate in lobby'
      }
    ],
    faq: [
      {
        question: 'Are hiking trails nearby?',
        answer: 'Yes, we have direct access to several hiking trails'
      },
      {
        question: 'Is there a restaurant on site?',
        answer: 'Yes, we have a restaurant serving local cuisine'
      }
    ]
  }
];

// Mock data for rooms
const createMockRooms = (hotelIds: string[]) => {
  const rooms = [];
  
  hotelIds.forEach((hotelId, hotelIndex) => {
    const hotel = mockHotels[hotelIndex];
    
    // Create different room types for each hotel
    const roomTypes = [
      {
        name: 'Standard Room',
        pricePerNight: 150 + (hotelIndex * 50),
        typePerson: 'single' as const,
        bedNumber: 1,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']
      },
      {
        name: 'Deluxe Room',
        pricePerNight: 250 + (hotelIndex * 75),
        typePerson: 'double' as const,
        bedNumber: 1,
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800']
      },
      {
        name: 'Suite',
        pricePerNight: 400 + (hotelIndex * 100),
        typePerson: 'double' as const,
        bedNumber: 2,
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800']
      },
      {
        name: 'Family Room',
        pricePerNight: 300 + (hotelIndex * 60),
        typePerson: 'triple' as const,
        bedNumber: 2,
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800']
      }
    ];

    roomTypes.forEach((roomType, roomIndex) => {
      rooms.push({
        hotelId: new mongoose.Types.ObjectId(hotelId),
        name: roomType.name,
        images: roomType.images,
        pricePerNight: roomType.pricePerNight,
        typePerson: roomType.typePerson,
        roomInformation: ['air_conditioning', 'room_service'],
        bathroom: ['private_bathroom', 'shower'],
        accessibility: ['wheelchair_accessible'],
        internet: ['free_wifi', 'high_speed_internet'],
        foodAndDrink: ['minibar', 'coffee_maker'],
        bedRoom: ['king_bed', 'extra_pillows'],
        other: ['safe', 'balcony'],
        entertainment: ['tv', 'netflix'],
        bedNumber: roomType.bedNumber
      });
    });
  });

  return rooms;
};

// Mock data for bookings
const createMockBookings = (userIds: string[], hotelIds: string[], roomIds: string[]) => {
  const bookings = [];
  const statuses = ['booked', 'completed', 'cancelled'] as const;
  
  // Create bookings for different scenarios
  const bookingScenarios = [
    {
      checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 3 days later
      adults: 2,
      children: 0,
      status: 'booked' as const
    },
    {
      checkInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      checkOutDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 3 days later
      adults: 1,
      children: 0,
      status: 'booked' as const
    },
    {
      checkInDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      checkOutDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), // 27 days ago
      adults: 2,
      children: 1,
      status: 'completed' as const
    },
    {
      checkInDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      checkOutDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      adults: 1,
      children: 0,
      status: 'cancelled' as const
    }
  ];

  // Create bookings for each user
  userIds.forEach((userId, userIndex) => {
    const scenario = bookingScenarios[userIndex % bookingScenarios.length];
    const hotelIndex = userIndex % hotelIds.length;
    const roomIndex = userIndex % roomIds.length;

    bookings.push({
      userId: new mongoose.Types.ObjectId(userId),
      hotelId: new mongoose.Types.ObjectId(hotelIds[hotelIndex]),
      roomId: new mongoose.Types.ObjectId(roomIds[roomIndex]),
      checkInDate: scenario.checkInDate,
      checkOutDate: scenario.checkOutDate,
      adults: scenario.adults,
      children: scenario.children,
      status: scenario.status
    });
  });

  return bookings;
};

// Main seeder function
export const seedMockData = async () => {
  try {
    console.log('🌱 Mock data seeding эхлүүлж байна...\n');

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 Database холболт эхлүүлж байна...');
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MONGO_URI environment variable тогтоогдоогүй байна');
      }
      await mongoose.connect(mongoUri);
    }

    // Clear existing data
    console.log('🧹 Хуучин өгөгдлийг цэвэрлэж байна...');
    await UserModel.deleteMany({});
    await HotelModel.deleteMany({});
    await RoomModel.deleteMany({});
    await BookingModel.deleteMany({});
    await EmergencyContactModel.deleteMany({});

    // Seed users
    console.log('👥 Хэрэглэгчид үүсгэж байна...');
    const createdUsers = await UserModel.insertMany(mockUsers);
    const userIds = createdUsers.map(user => user._id.toString());
    console.log(`✅ ${createdUsers.length} хэрэглэгч үүсгэгдлээ`);

    // Seed hotels
    console.log('🏨 Зочид буудлууд үүсгэж байна...');
    const createdHotels = await HotelModel.insertMany(mockHotels);
    const hotelIds = createdHotels.map(hotel => hotel._id.toString());
    console.log(`✅ ${createdHotels.length} зочид буудал үүсгэгдлээ`);

    // Seed rooms
    console.log('🛏️ Өрөөнүүд үүсгэж байна...');
    const mockRooms = createMockRooms(hotelIds);
    const createdRooms = await RoomModel.insertMany(mockRooms);
    const roomIds = createdRooms.map(room => room._id.toString());
    console.log(`✅ ${createdRooms.length} өрөө үүсгэгдлээ`);

    // Seed bookings
    console.log('📅 Захиалгууд үүсгэж байна...');
    const mockBookings = createMockBookings(userIds, hotelIds, roomIds);
    const createdBookings = await BookingModel.insertMany(mockBookings);
    console.log(`✅ ${createdBookings.length} захиалга үүсгэгдлээ`);

    console.log('\n🎉 Бүх mock data амжилттай үүсгэгдлээ!');
    
    return {
      success: true,
      message: 'Mock data seeding амжилттай',
      summary: {
        users: createdUsers.length,
        hotels: createdHotels.length,
        rooms: createdRooms.length,
        bookings: createdBookings.length
      }
    };

  } catch (error) {
    console.error('❌ Mock data seeding амжилтгүй:', error);
    return {
      success: false,
      message: `Seeding амжилтгүй: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to seed specific data types
export const seedUsersOnly = async () => {
  try {
    console.log('👥 Зөвхөн хэрэглэгчид үүсгэж байна...');
    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(mockUsers);
    console.log(`✅ ${createdUsers.length} хэрэглэгч үүсгэгдлээ`);
    return { success: true, count: createdUsers.length };
  } catch (error) {
    console.error('❌ Хэрэглэгч үүсгэх амжилтгүй:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const seedHotelsOnly = async () => {
  try {
    console.log('🏨 Зөвхөн зочид буудлууд үүсгэж байна...');
    await HotelModel.deleteMany({});
    const createdHotels = await HotelModel.insertMany(mockHotels);
    console.log(`✅ ${createdHotels.length} зочид буудал үүсгэгдлээ`);
    return { success: true, count: createdHotels.length };
  } catch (error) {
    console.error('❌ Зочид буудал үүсгэх амжилтгүй:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to get seeding statistics
export const getSeedingStats = async () => {
  try {
    const userCount = await UserModel.countDocuments();
    const hotelCount = await HotelModel.countDocuments();
    const roomCount = await RoomModel.countDocuments();
    const bookingCount = await BookingModel.countDocuments();

    return {
      users: userCount,
      hotels: hotelCount,
      rooms: roomCount,
      bookings: bookingCount
    };
  } catch (error) {
    console.error('❌ Статистик авах амжилтгүй:', error);
    return null;
  }
};

// Function to clear all data
export const clearAllData = async () => {
  try {
    console.log('🧹 Бүх өгөгдлийг устгаж байна...');
    await UserModel.deleteMany({});
    await HotelModel.deleteMany({});
    await RoomModel.deleteMany({});
    await BookingModel.deleteMany({});
    await EmergencyContactModel.deleteMany({});
    console.log('✅ Бүх өгөгдөл устгагдлаа');
    return { success: true };
  } catch (error) {
    console.error('❌ Өгөгдөл устгах амжилтгүй:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};




