import { renderHook, act } from '@testing-library/react';
import { useOtpCode } from '../../../src/components/signup/hooks';

describe('useOtpCode Hook', () => {
  it('should handle code input and validation', () => {
    const { result } = renderHook(() => useOtpCode());
    expect(result.current.code).toEqual(['', '', '', '']);

    act(() => result.current.handleChange('1', 0));
    expect(result.current.code).toEqual(['1', '', '', '']);

    act(() => result.current.handleChange('a', 1));
    expect(result.current.code).toEqual(['1', '', '', '']);
  });

  it('should auto-focus next input when entering digit', () => {
    const { result } = renderHook(() => useOtpCode());
    const mockFocus = jest.fn();

    result.current.inputsRef.current = [{ focus: jest.fn() }, { focus: mockFocus }, { focus: jest.fn() }, { focus: jest.fn() }] as any;

    act(() => {
      result.current.handleChange('2', 0);
    });

    expect(mockFocus).toHaveBeenCalled();
  });

  it('should not auto-focus next input at last position', () => {
    const { result } = renderHook(() => useOtpCode());
    const mockFocus = jest.fn();

    result.current.inputsRef.current = [{ focus: jest.fn() }, { focus: jest.fn() }, { focus: jest.fn() }, { focus: mockFocus }] as any;

    act(() => {
      result.current.handleChange('4', 3);
    });

    expect(mockFocus).not.toHaveBeenCalled();
  });

  it('should handle backspace navigation', () => {
    const { result } = renderHook(() => useOtpCode());
    const mockFocus = jest.fn();

    result.current.inputsRef.current = [{ focus: mockFocus }, { focus: jest.fn() }, { focus: jest.fn() }, { focus: jest.fn() }] as any;

    act(() => {
      result.current.handleKeyDown({ key: 'Backspace' } as any, 1);
    });
    expect(mockFocus).toHaveBeenCalled();
  });

  it('should not handle backspace navigation at first position', () => {
    const { result } = renderHook(() => useOtpCode());
    const mockFocus = jest.fn();

    result.current.inputsRef.current = [{ focus: mockFocus }, { focus: jest.fn() }, { focus: jest.fn() }, { focus: jest.fn() }] as any;

    act(() => {
      result.current.handleKeyDown({ key: 'Backspace' } as any, 0);
    });
    expect(mockFocus).not.toHaveBeenCalled();
  });

  it('should not handle backspace when input has value', () => {
    const { result } = renderHook(() => useOtpCode());
    const mockFocus = jest.fn();

    result.current.inputsRef.current = [{ focus: mockFocus }, { focus: jest.fn() }, { focus: jest.fn() }, { focus: jest.fn() }] as any;

    act(() => {
      result.current.handleChange('1', 1); // Add value to position 1
    });
    act(() => {
      result.current.handleKeyDown({ key: 'Backspace' } as any, 1);
    });
    expect(mockFocus).not.toHaveBeenCalled();
  });
});
