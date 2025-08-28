/* eslint-disable no-secrets/no-secrets */
import { mapBookingStatusToGraphQL, mapGraphQLToMongooseBookingStatus } from '../../../src/resolvers/common/booking-status.mapper';

describe('Booking Status Mapper', () => {
  describe('mapBookingStatusToGraphQL', () => {
    it('should map "booked" to "BOOKED"', () => {
      expect(mapBookingStatusToGraphQL('booked')).toBe('BOOKED');
    });

    it('should map "completed" to "COMPLETED"', () => {
      expect(mapBookingStatusToGraphQL('completed')).toBe('COMPLETED');
    });

    it('should map "cancelled" to "CANCELLED"', () => {
      expect(mapBookingStatusToGraphQL('cancelled')).toBe('CANCELLED');
    });

    it('should return "BOOKED" for unknown status', () => {
      expect(mapBookingStatusToGraphQL('unknown')).toBe('BOOKED');
    });

    it('should return "BOOKED" for empty string', () => {
      expect(mapBookingStatusToGraphQL('')).toBe('BOOKED');
    });
  });

  describe('mapGraphQLToMongooseBookingStatus', () => {
    it('should map "BOOKED" to "booked"', () => {
      expect(mapGraphQLToMongooseBookingStatus('BOOKED')).toBe('booked');
    });

    it('should map "COMPLETED" to "completed"', () => {
      expect(mapGraphQLToMongooseBookingStatus('COMPLETED')).toBe('completed');
    });

    it('should map "CANCELLED" to "cancelled"', () => {
      expect(mapGraphQLToMongooseBookingStatus('CANCELLED')).toBe('cancelled');
    });

    it('should return original status for unknown status', () => {
      expect(mapGraphQLToMongooseBookingStatus('UNKNOWN')).toBe('UNKNOWN');
    });

    it('should return original status for empty string', () => {
      expect(mapGraphQLToMongooseBookingStatus('')).toBe('');
    });
  });
});
