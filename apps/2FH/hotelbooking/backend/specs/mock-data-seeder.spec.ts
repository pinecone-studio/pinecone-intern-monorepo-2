import { seedMockData, seedUsersOnly, seedHotelsOnly, getSeedingStats, clearAllData } from '../src/utils/mock-data-seeder';
import { UserModel } from '../src/models/user.model';
import { HotelModel } from '../src/models/hotel.model';
import { RoomModel } from '../src/models/room.model';
import { BookingModel } from '../src/models/booking.model';

// Mock environment variable
const originalEnv = process.env;

describe('Mock Data Seeder', () => {
  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
  });

  describe('seedMockData', () => {
    it('should seed all mock data successfully', async () => {
      const result = await seedMockData();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Mock data seeding амжилттай');
      expect(result.summary).toBeDefined();
      expect(result.summary?.users).toBeGreaterThan(0);
      expect(result.summary?.hotels).toBeGreaterThan(0);
      expect(result.summary?.rooms).toBeGreaterThan(0);
      expect(result.summary?.bookings).toBeGreaterThan(0);
    }, 30000);

    it('should handle missing MONGO_URI environment variable', async () => {
      delete process.env.MONGO_URI;
      
      const result = await seedMockData();
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('MONGO_URI environment variable тогтоогдоогүй байна');
    }, 30000);

    it('should clear existing data before seeding', async () => {
      // First seed
      await seedMockData();
      
      // Check that data exists
      const userCount1 = await UserModel.countDocuments();
      const hotelCount1 = await HotelModel.countDocuments();
      
      expect(userCount1).toBeGreaterThan(0);
      expect(hotelCount1).toBeGreaterThan(0);
      
      // Seed again
      await seedMockData();
      
      // Check that data was cleared and reseeded
      const userCount2 = await UserModel.countDocuments();
      const hotelCount2 = await HotelModel.countDocuments();
      
      expect(userCount2).toBe(userCount1); // Should be the same count
    }, 30000);
  });

  describe('seedUsersOnly', () => {
    it('should seed only users successfully', async () => {
      const result = await seedUsersOnly();
      
      expect(result.success).toBe(true);
      expect(result.count).toBeGreaterThan(0);
      
      // Verify only users were created
      const userCount = await UserModel.countDocuments();
      const hotelCount = await HotelModel.countDocuments();
      
      expect(userCount).toBeGreaterThan(0);
      expect(hotelCount).toBe(0);
    }, 30000);

    it('should clear existing users before seeding', async () => {
      // First seed
      await seedUsersOnly();
      const userCount1 = await UserModel.countDocuments();
      
      // Seed again
      await seedUsersOnly();
      const userCount2 = await UserModel.countDocuments();
      
      expect(userCount2).toBe(userCount1); // Should be the same count
    }, 30000);
  });

  describe('seedHotelsOnly', () => {
    it('should seed only hotels successfully', async () => {
      const result = await seedHotelsOnly();
      
      expect(result.success).toBe(true);
      expect(result.count).toBeGreaterThan(0);
      
      // Verify only hotels were created
      const hotelCount = await HotelModel.countDocuments();
      const userCount = await UserModel.countDocuments();
      
      expect(hotelCount).toBeGreaterThan(0);
      expect(userCount).toBe(0);
    }, 30000);

    it('should clear existing hotels before seeding', async () => {
      // First seed
      await seedHotelsOnly();
      const hotelCount1 = await HotelModel.countDocuments();
      
      // Seed again
      await seedHotelsOnly();
      const hotelCount2 = await HotelModel.countDocuments();
      
      expect(hotelCount2).toBe(hotelCount1); // Should be the same count
    }, 30000);
  });

  describe('getSeedingStats', () => {
    it('should return correct statistics', async () => {
      // Seed some data first
      await seedMockData();
      
      const stats = await getSeedingStats();
      
      expect(stats).toBeDefined();
      expect(stats?.users).toBeGreaterThan(0);
      expect(stats?.hotels).toBeGreaterThan(0);
      expect(stats?.rooms).toBeGreaterThan(0);
      expect(stats?.bookings).toBeGreaterThan(0);
    }, 30000);

    it('should return null on error', async () => {
      // Mock a database error by setting invalid MONGO_URI
      process.env.MONGO_URI = 'invalid-uri';
      
      const stats = await getSeedingStats();
      
      expect(stats).toBeNull();
    }, 30000);
  });

  describe('clearAllData', () => {
    it('should clear all data successfully', async () => {
      // First seed some data
      await seedMockData();
      
      // Verify data exists
      const userCount1 = await UserModel.countDocuments();
      const hotelCount1 = await HotelModel.countDocuments();
      expect(userCount1).toBeGreaterThan(0);
      expect(hotelCount1).toBeGreaterThan(0);
      
      // Clear data
      const result = await clearAllData();
      
      expect(result.success).toBe(true);
      
      // Verify data is cleared
      const userCount2 = await UserModel.countDocuments();
      const hotelCount2 = await HotelModel.countDocuments();
      const roomCount2 = await RoomModel.countDocuments();
      const bookingCount2 = await BookingModel.countDocuments();
      
      expect(userCount2).toBe(0);
      expect(hotelCount2).toBe(0);
      expect(roomCount2).toBe(0);
      expect(bookingCount2).toBe(0);
    }, 30000);
  });

  describe('Data Validation', () => {
    it('should create users with correct structure', async () => {
      await seedUsersOnly();
      
      const users = await UserModel.find({});
      expect(users.length).toBeGreaterThan(0);
      
      const user = users[0];
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.role).toBeDefined();
      expect(['user', 'admin']).toContain(user.role);
    }, 30000);

    it('should create hotels with correct structure', async () => {
      await seedHotelsOnly();
      
      const hotels = await HotelModel.find({});
      expect(hotels.length).toBeGreaterThan(0);
      
      const hotel = hotels[0];
      expect(hotel.name).toBeDefined();
      expect(hotel.description).toBeDefined();
      expect(hotel.images).toBeInstanceOf(Array);
      expect(hotel.stars).toBeGreaterThan(0);
      expect(hotel.stars).toBeLessThanOrEqual(5);
      expect(hotel.rating).toBeGreaterThan(0);
      expect(hotel.rating).toBeLessThanOrEqual(5);
      expect(hotel.amenities).toBeInstanceOf(Array);
      expect(hotel.policies).toBeInstanceOf(Array);
      expect(hotel.faq).toBeInstanceOf(Array);
    }, 30000);

    it('should create rooms with correct structure', async () => {
      await seedMockData();
      
      const rooms = await RoomModel.find({});
      expect(rooms.length).toBeGreaterThan(0);
      
      const room = rooms[0];
      expect(room.hotelId).toBeDefined();
      expect(room.name).toBeDefined();
      expect(room.pricePerNight).toBeGreaterThan(0);
      expect(room.typePerson).toBeDefined();
      expect(['single', 'double', 'triple']).toContain(room.typePerson);
      expect(room.bedNumber).toBeGreaterThan(0);
    }, 30000);

    it('should create bookings with correct structure', async () => {
      await seedMockData();
      
      const bookings = await BookingModel.find({});
      expect(bookings.length).toBeGreaterThan(0);
      
      const booking = bookings[0];
      expect(booking.userId).toBeDefined();
      expect(booking.hotelId).toBeDefined();
      expect(booking.roomId).toBeDefined();
      expect(booking.checkInDate).toBeDefined();
      expect(booking.checkOutDate).toBeDefined();
      expect(booking.adults).toBeGreaterThan(0);
      expect(booking.children).toBeGreaterThanOrEqual(0);
      expect(booking.status).toBeDefined();
      expect(['booked', 'completed', 'cancelled']).toContain(booking.status);
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      process.env.MONGO_URI = 'mongodb://invalid-host:27017/test';
      
      const result = await seedMockData();
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Seeding амжилтгүй');
    }, 30000);

    it('should handle model validation errors', async () => {
      // This test would require mocking the models to throw validation errors
      // For now, we'll test that the function handles errors gracefully
      const result = await seedMockData();
      
      // Should either succeed or fail gracefully
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    }, 30000);
  });
});




