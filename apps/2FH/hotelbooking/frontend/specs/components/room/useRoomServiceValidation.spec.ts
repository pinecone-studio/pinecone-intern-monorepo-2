import { renderHook, act } from '@testing-library/react';
import { useRoomServiceValidation } from '../../../src/components/room/useRoomServiceValidation';

describe('useRoomServiceValidation', () => {
  const mockFormData = {
    bathroom: ['Private'],
    accessibility: ['Wheelchair'],
    entertainment: ['TV'],
    foodAndDrink: ['Breakfast'],
    other: ['Desk'],
    internet: ['WiFi'],
    bedRoom: ['AC'],
  };

  it('should initialize with empty errors', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    expect(result.current.errors).toEqual({});
  });

  it('should validate form with valid data', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const isValid = result.current.validateForm();
      expect(isValid).toBe(true);
    });

    expect(result.current.errors).toEqual({});
  });

  it('should validate form with invalid data', () => {
    const invalidFormData = {
      bathroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      other: [],
      internet: [],
      bedRoom: [],
    };

    const { result } = renderHook(() => useRoomServiceValidation(invalidFormData));

    act(() => {
      const isValid = result.current.validateForm();
      expect(isValid).toBe(false);
    });

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should validate individual fields', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('bathroom', []);
      expect(error).toBe('Please select at least one bathroom service');
    });
  });

  it('should set errors manually', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      result.current.setErrors({ bathroom: 'Test error' });
    });

    expect(result.current.errors.bathroom).toBe('Test error');
  });

  it('should validate bathroom field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('bathroom', []);
      expect(error).toBe('Please select at least one bathroom service');
    });
  });

  it('should validate accessibility field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('accessibility', []);
      expect(error).toBe('Please select at least one accessibility option');
    });
  });

  it('should validate entertainment field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('entertainment', []);
      expect(error).toBe('Please select at least one entertainment option');
    });
  });

  it('should validate foodAndDrink field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('foodAndDrink', []);
      expect(error).toBe('Please select at least one food and drink option');
    });
  });

  it('should validate internet field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('internet', []);
      expect(error).toBe('Please select at least one internet option');
    });
  });

  it('should validate bedRoom field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('bedRoom', []);
      expect(error).toBe('Please select at least one bedroom option');
    });
  });

  it('should validate other field', () => {
    const { result } = renderHook(() => useRoomServiceValidation(mockFormData));

    act(() => {
      const error = result.current.validateField('other', []);
      expect(error).toBe('Please select at least one other option');
    });
  });
});
