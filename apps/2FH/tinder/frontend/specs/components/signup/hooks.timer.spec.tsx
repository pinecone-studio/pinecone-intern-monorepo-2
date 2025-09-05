import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../../../src/components/signup/hooks';

describe('useTimer Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize and countdown timer', () => {
    const { result } = renderHook(() => useTimer(3));
    expect(result.current.timer).toBe(3);

    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.timer).toBe(2);

    act(() => result.current.resetTimer());
    expect(result.current.timer).toBe(3);
  });

  it('should not start countdown when timer is 0', () => {
    const { result } = renderHook(() => useTimer(0));
    expect(result.current.timer).toBe(0);

    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.timer).toBe(0); // Should remain 0
  });

  it('should cleanup interval when timer reaches 0', () => {
    const { result } = renderHook(() => useTimer(1));
    expect(result.current.timer).toBe(1);

    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.timer).toBe(0);

    // Timer should not continue counting down
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.timer).toBe(0);
  });

  it('should handle different initial timer values', () => {
    const { result: result1 } = renderHook(() => useTimer(5));
    expect(result1.current.timer).toBe(5);

    const { result: result2 } = renderHook(() => useTimer(10));
    expect(result2.current.timer).toBe(10);

    const { result: result3 } = renderHook(() => useTimer(0));
    expect(result3.current.timer).toBe(0);
  });

  it('should reset timer to initial value', () => {
    const { result } = renderHook(() => useTimer(5));
    expect(result.current.timer).toBe(5);

    act(() => jest.advanceTimersByTime(2000));
    expect(result.current.timer).toBe(3);

    act(() => result.current.resetTimer());
    expect(result.current.timer).toBe(5);
  });
});
