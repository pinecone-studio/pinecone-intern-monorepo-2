import React from 'react';
import { render, screen } from '@/TestUtils';
import {
  mockHotel,
  mockHotels,
  mockRouter,
  mockUseRouter,
  mockUseParams,
  waitForLoadingToFinish,
  createMockGraphQLResponse,
  mockCreateHotelMutation,
  mockHotelsQuery,
  mockHotelQuery,
} from '../../src/TestUtils';

// Test component to test the custom render function
const TestComponent = () => <div>Test Component</div>;

describe('test-utils', () => {
  describe('mockHotel', () => {
    it('should have required hotel properties', () => {
      expect(mockHotel).toHaveProperty('id');
      expect(mockHotel).toHaveProperty('name');
      expect(mockHotel).toHaveProperty('description');
      expect(mockHotel).toHaveProperty('rating');
      expect(mockHotel).toHaveProperty('stars');
    });
  });

  describe('mockHotels', () => {
    it('should be an array of hotels', () => {
      expect(Array.isArray(mockHotels)).toBe(true);
      expect(mockHotels.length).toBeGreaterThan(0);
      expect(mockHotels[0]).toHaveProperty('id');
    });
  });

  describe('mockRouter', () => {
    it('should have router methods', () => {
      expect(mockRouter).toHaveProperty('push');
      expect(mockRouter).toHaveProperty('back');
      expect(mockRouter).toHaveProperty('forward');
      expect(mockRouter).toHaveProperty('refresh');
    });
  });

  describe('mockUseRouter', () => {
    it('should return mock router', () => {
      const router = mockUseRouter();
      expect(router).toBe(mockRouter);
    });
  });

  describe('mockUseParams', () => {
    it('should return provided params', () => {
      const params = { id: 'test-id' };
      const result = mockUseParams(params);
      expect(result).toBe(params);
    });
  });

  describe('waitForLoadingToFinish', () => {
    it('should return a promise that resolves', async () => {
      const promise = waitForLoadingToFinish();
      expect(promise).toBeInstanceOf(Promise);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('createMockGraphQLResponse', () => {
    it('should create a mock response with data', () => {
      const data = { test: 'data' };
      const response = createMockGraphQLResponse(data);
      expect(response).toHaveProperty('data', data);
      expect(response).toHaveProperty('loading', false);
      expect(response).toHaveProperty('error', null);
    });

    it('should create a mock response with loading state', () => {
      const data = { test: 'data' };
      const response = createMockGraphQLResponse(data, true);
      expect(response).toHaveProperty('data', data);
      expect(response).toHaveProperty('loading', true);
      expect(response).toHaveProperty('error', null);
    });

    it('should create a mock response with error', () => {
      const data = { test: 'data' };
      const error = new Error('Test error');
      const response = createMockGraphQLResponse(data, false, error);
      expect(response).toHaveProperty('data', data);
      expect(response).toHaveProperty('loading', false);
      expect(response).toHaveProperty('error', error);
    });
  });

  describe('mockCreateHotelMutation', () => {
    it('should have request and result properties', () => {
      expect(mockCreateHotelMutation).toHaveProperty('request');
      expect(mockCreateHotelMutation).toHaveProperty('result');
    });
  });

  describe('mockHotelsQuery', () => {
    it('should have request and result properties', () => {
      expect(mockHotelsQuery).toHaveProperty('request');
      expect(mockHotelsQuery).toHaveProperty('result');
    });
  });

  describe('mockHotelQuery', () => {
    it('should have request and result properties', () => {
      expect(mockHotelQuery).toHaveProperty('request');
      expect(mockHotelQuery).toHaveProperty('result');
    });
  });

  describe('custom render function', () => {
    it('should render component with providers', () => {
      render(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });
});
