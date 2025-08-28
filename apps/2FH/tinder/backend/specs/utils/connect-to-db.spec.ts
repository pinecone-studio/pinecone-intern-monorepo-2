import { connect } from 'mongoose';
import { connectToDb } from '../../src/utils/connect-to-db';
jest.mock('mongoose', () => ({
  connect: jest.fn(),}));
const mockConnect = connect as jest.MockedFunction<typeof connect>;
describe('connectToDb', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };});
  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();});
  describe('successful connection', () => {
    it('should connect to MongoDB successfully when MONGO_URI is set', async () => {
      const mockMongoUri = 'mongodb://localhost:27017/test';
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockResolvedValue({} as any);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      await connectToDb();
      expect(mockConnect).toHaveBeenCalledWith(mockMongoUri);
      expect(consoleSpy).toHaveBeenCalledWith('🔌 Attempting to connect to MongoDB...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Connected to MongoDB successfully');});
    it('should handle successful connection without throwing errors', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mockConnect.mockResolvedValue({} as any);
      await expect(connectToDb()).resolves.not.toThrow();});});
  describe('connection failures', () => {
    it('should throw error when MONGO_URI is not set', async () => {
      delete process.env.MONGO_URI;
      await expect(connectToDb()).rejects.toThrow('MONGO_URI environment variable is not set');});
    it('should throw error when MONGO_URI is empty string', async () => {
      process.env.MONGO_URI = '';
      await expect(connectToDb()).rejects.toThrow('MONGO_URI environment variable is not set');});
    it('should throw error when MONGO_URI is undefined', async () => {
      process.env.MONGO_URI = undefined;
      await expect(connectToDb()).rejects.toThrow('MONGO_URI environment variable is not set');});
    it('should throw error when mongoose.connect fails', async () => {
      const mockMongoUri = 'mongodb://localhost:27017/test';
      const mockError = new Error('Connection failed');
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockRejectedValue(mockError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      await expect(connectToDb()).rejects.toThrow('Connection failed');
      expect(mockConnect).toHaveBeenCalledWith(mockMongoUri);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to connect to MongoDB:', mockError);});
    it('should throw error when mongoose.connect throws network error', async () => {
      const mockMongoUri = 'mongodb://localhost:27017/test';
      const networkError = new Error('ECONNREFUSED: Connection refused');
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockRejectedValue(networkError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      await expect(connectToDb()).rejects.toThrow('ECONNREFUSED: Connection refused');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to connect to MongoDB:', networkError);});});
  describe('environment variable handling', () => {
    it('should handle MONGO_URI with special characters', async () => {
      const mockMongoUri = 'mongodb://test:test@localhost:27017/test?authSource=admin';
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockResolvedValue({} as any);
      jest.spyOn(console, 'log').mockImplementation(() => undefined);
      await connectToDb();
      expect(mockConnect).toHaveBeenCalledWith(mockMongoUri);});
    it('should handle MONGO_URI with spaces', async () => {
      const mockMongoUri = 'mongodb://localhost:27017/test database';
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockResolvedValue({} as any);
      jest.spyOn(console, 'log').mockImplementation(() => undefined);
      await connectToDb();
      expect(mockConnect).toHaveBeenCalledWith(mockMongoUri);});});

  describe('console output', () => {
    it('should log appropriate messages during connection process', async () => {
      // Arrange
      const mockMongoUri = 'mongodb://localhost:27017/test';
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockResolvedValue({} as any);

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      await connectToDb();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('🔌 Attempting to connect to MongoDB...');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Connected to MongoDB successfully');
    });

    it('should log error messages when connection fails', async () => {
      // Arrange
      const mockMongoUri = 'mongodb://localhost:27017/test';
      const mockError = new Error('Database connection failed');
      process.env.MONGO_URI = mockMongoUri;
      mockConnect.mockRejectedValue(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(connectToDb()).rejects.toThrow('Database connection failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to connect to MongoDB:', mockError);
    });
  });
}); 