/* eslint-disable no-secrets/no-secrets */
import { BookingStatus } from '../../../src/generated';
import { 
  mapBookingStatusToGraphQL, 
  mapGraphQLToMongooseBookingStatus,
  mapMongooseToGraphQLBookingStatus 
} from '../../../src/resolvers/common/booking-status.mapper';

describe('Booking Status Mapper', () => {
  describe('mapBookingStatusToGraphQL', () => {
    it('should map "booked" to "BOOKED"', () => {
      expect(mapBookingStatusToGraphQL('booked')).toBe(BookingStatus.Booked);
    });

    it('should map "completed" to "COMPLETED"', () => {
      expect(mapBookingStatusToGraphQL('completed')).toBe(BookingStatus.Completed);
    });

    it('should map "cancelled" to "CANCELLED"', () => {
      expect(mapBookingStatusToGraphQL('cancelled')).toBe(BookingStatus.Cancelled);
    });

    it('should return "BOOKED" for unknown status', () => {
      expect(mapBookingStatusToGraphQL('unknown')).toBe(BookingStatus.Booked);
    });

    it('should return "BOOKED" for empty string', () => {
      expect(mapBookingStatusToGraphQL('')).toBe(BookingStatus.Booked);
    });

    it('should return "BOOKED" for null status', () => {
      expect(mapBookingStatusToGraphQL(null as any)).toBe(BookingStatus.Booked);
    });

    it('should return "BOOKED" for undefined status', () => {
      expect(mapBookingStatusToGraphQL(undefined as any)).toBe(BookingStatus.Booked);
    });
  });

  describe('mapGraphQLToMongooseBookingStatus', () => {
    it('should map "BOOKED" to "booked"', () => {
      expect(mapGraphQLToMongooseBookingStatus(BookingStatus.Booked)).toBe('booked');
    });

    it('should map "COMPLETED" to "completed"', () => {
      expect(mapGraphQLToMongooseBookingStatus(BookingStatus.Completed)).toBe('completed');
    });

    it('should map "CANCELLED" to "cancelled"', () => {
      expect(mapGraphQLToMongooseBookingStatus(BookingStatus.Cancelled)).toBe('cancelled');
    });
  });

  describe('mapMongooseToGraphQLBookingStatus', () => {
    it('should map "booked" to "BOOKED"', () => {
      expect(mapMongooseToGraphQLBookingStatus('booked')).toBe(BookingStatus.Booked);
    });

    it('should map "completed" to "COMPLETED"', () => {
      expect(mapMongooseToGraphQLBookingStatus('completed')).toBe(BookingStatus.Completed);
    });

    it('should map "cancelled" to "CANCELLED"', () => {
      expect(mapMongooseToGraphQLBookingStatus('cancelled')).toBe(BookingStatus.Cancelled);
    });

    it('should throw error for invalid status', () => {
      expect(() => mapMongooseToGraphQLBookingStatus('invalid')).toThrow('Invalid Mongoose status: invalid');
    });

    it('should throw error for empty string', () => {
      expect(() => mapMongooseToGraphQLBookingStatus('')).toThrow('Invalid Mongoose status: ');
    });

    it('should throw error for null status', () => {
      expect(() => mapMongooseToGraphQLBookingStatus(null as any)).toThrow('Invalid Mongoose status: null');
    });

    it('should throw error for undefined status', () => {
      expect(() => mapMongooseToGraphQLBookingStatus(undefined as any)).toThrow('Invalid Mongoose status: undefined');
    });
  });
});
