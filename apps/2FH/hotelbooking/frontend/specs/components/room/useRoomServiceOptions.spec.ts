import { renderHook } from '@testing-library/react';
import { useRoomServiceOptions } from '../../../src/components/room/useRoomServiceOptions';

describe('useRoomServiceOptions', () => {
  it('should return bathroom options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.bathroomOptions).toBeDefined();
    expect(result.current.bathroomOptions.length).toBeGreaterThan(0);
    expect(result.current.bathroomOptions[0]).toHaveProperty('value');
    expect(result.current.bathroomOptions[0]).toHaveProperty('label');
  });

  it('should return accessibility options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.accessibilityOptions).toBeDefined();
    expect(result.current.accessibilityOptions.length).toBeGreaterThan(0);
    expect(result.current.accessibilityOptions[0]).toHaveProperty('value');
    expect(result.current.accessibilityOptions[0]).toHaveProperty('label');
  });

  it('should return entertainment options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.entertainmentOptions).toBeDefined();
    expect(result.current.entertainmentOptions.length).toBeGreaterThan(0);
    expect(result.current.entertainmentOptions[0]).toHaveProperty('value');
    expect(result.current.entertainmentOptions[0]).toHaveProperty('label');
  });

  it('should return foodAndDrink options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.foodAndDrinkOptions).toBeDefined();
    expect(result.current.foodAndDrinkOptions.length).toBeGreaterThan(0);
    expect(result.current.foodAndDrinkOptions[0]).toHaveProperty('value');
    expect(result.current.foodAndDrinkOptions[0]).toHaveProperty('label');
  });

  it('should return other options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.otherOptions).toBeDefined();
    expect(result.current.otherOptions.length).toBeGreaterThan(0);
    expect(result.current.otherOptions[0]).toHaveProperty('value');
    expect(result.current.otherOptions[0]).toHaveProperty('label');
  });

  it('should return internet options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.internetOptions).toBeDefined();
    expect(result.current.internetOptions.length).toBeGreaterThan(0);
    expect(result.current.internetOptions[0]).toHaveProperty('value');
    expect(result.current.internetOptions[0]).toHaveProperty('label');
  });

  it('should return bedRoom options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    expect(result.current.bedRoomOptions).toBeDefined();
    expect(result.current.bedRoomOptions.length).toBeGreaterThan(0);
    expect(result.current.bedRoomOptions[0]).toHaveProperty('value');
    expect(result.current.bedRoomOptions[0]).toHaveProperty('label');
  });

  it('should return all required options', () => {
    const { result } = renderHook(() => useRoomServiceOptions());

    const expectedOptions = ['bathroomOptions', 'accessibilityOptions', 'entertainmentOptions', 'foodAndDrinkOptions', 'otherOptions', 'internetOptions', 'bedRoomOptions'];

    expectedOptions.forEach((option) => {
      expect(result.current).toHaveProperty(option);
    });
  });
});
