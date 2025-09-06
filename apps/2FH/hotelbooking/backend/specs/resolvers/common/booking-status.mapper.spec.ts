/* eslint-disable no-secrets/no-secrets */
import { mapBookingStatusToGraphQL, mapGraphQLToMongooseBookingStatus } from '../../../src/resolvers/common/booking-status.mapper';

describe('Booking Status Mapper', () => {
  describe('mapBookingStatusToGraphQL', () => {
    it('should map "Booked" to "BOOKED"', () => {
      expect(mapBookingStatusToGraphQL('Booked')).toBe('Booked');
    });

    it('should map "Completed" to "Completed"', () => {
      expect(mapBookingStatusToGraphQL('Completed')).toBe('Completed');
    });

    it('should map "Cancelled" to "Cancelled"', () => {
      expect(mapBookingStatusToGraphQL('Cancelled')).toBe('Cancelled');
    });
  });

  describe('mapGraphQLToMongooseBookingStatus', () => {
    it('should map "Booked" to "Booked"', () => {
      expect(mapGraphQLToMongooseBookingStatus('Booked')).toBe('Booked');
    });

    it('should map "Completed" to "Completed"', () => {
      expect(mapGraphQLToMongooseBookingStatus('Completed')).toBe('Completed');
    });

    it('should map "Cancelled" to "Cancelled"', () => {
      expect(mapGraphQLToMongooseBookingStatus('Cancelled')).toBe('Cancelled');
    });

    it('should return original status for unknown status', () => {
      expect(mapGraphQLToMongooseBookingStatus('UNKNOWN')).toBe('UNKNOWN');
    });

    it('should return original status for empty string', () => {
      expect(mapGraphQLToMongooseBookingStatus('')).toBe('');
    });
  });
});
