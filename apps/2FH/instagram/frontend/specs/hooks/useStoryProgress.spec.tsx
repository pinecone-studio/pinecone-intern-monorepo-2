import { renderHook, act } from '@testing-library/react';
import { useStoryProgress } from '@/hooks/useStoryProgress';

describe('useStoryProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('returns 0 progress when storiesLength is 0', () => {
    const mockOnNext = jest.fn();
    const { result } = renderHook(() =>
      useStoryProgress({
        storiesLength: 0,
        currentIndex: 0,
        onNext: mockOnNext,
      })
    );

    expect(result.current).toBe(0);
    
    // Advance timers to ensure no progress happens
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current).toBe(0);
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('progresses normally when storiesLength is greater than 0', () => {
    const mockOnNext = jest.fn();
    const { result } = renderHook(() =>
      useStoryProgress({
        storiesLength: 2,
        currentIndex: 0,
        onNext: mockOnNext,
      })
    );

    expect(result.current).toBe(0);
    
    // Advance time to progress
    act(() => {
      jest.advanceTimersByTime(100); // 2 intervals of 50ms each
    });
    
    expect(result.current).toBe(2);
  });

  it('calls onNext when progress reaches 100%', async () => {
    const mockOnNext = jest.fn();
    const { result } = renderHook(() =>
      useStoryProgress({
        storiesLength: 1,
        currentIndex: 0,
        onNext: mockOnNext,
      })
    );

    expect(result.current).toBe(0);
    
    // Advance time to complete progress
    await act(async () => {
      jest.advanceTimersByTime(5100); // More than 100 * 50ms
      await Promise.resolve(); // Allow microtask to complete
    });
    
    expect(result.current).toBe(100);
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('resets progress when currentIndex changes', () => {
    const mockOnNext = jest.fn();
    const { result, rerender } = renderHook(
      ({ currentIndex }) =>
        useStoryProgress({
          storiesLength: 2,
          currentIndex,
          onNext: mockOnNext,
        }),
      { initialProps: { currentIndex: 0 } }
    );

    // Progress to 50%
    act(() => {
      jest.advanceTimersByTime(2500); // 50 * 50ms
    });
    
    expect(result.current).toBe(50);

    // Change currentIndex
    rerender({ currentIndex: 1 });

    // Progress should reset to 0
    expect(result.current).toBe(0);
  });
});
