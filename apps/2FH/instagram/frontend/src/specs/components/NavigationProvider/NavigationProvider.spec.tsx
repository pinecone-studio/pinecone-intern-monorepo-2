// import { NavigationProvider, useNavigation } from '@/components';
// import { renderHook } from '@testing-library/react';

// import React from 'react';

// describe('NavigationProvider', () => {
//   it('useNavigation-г provider-гүй ашиглахад алдаа өгнө', () => {
//     // Provider-гүй renderHook-д алдаа гарахыг шалгах
//     const { result } = renderHook(() => useNavigation(), {
//       wrapper: ({ children }) => <>{children}</>, // Ямар ч provider байхгүй
//     });

//     expect(result.error).toEqual(new Error('useNavigation must be used within NavigationProvider'));
//   });

//   it('useNavigation-г provider-тай ашиглахад зөв ажиллана', () => {
//     // Provider-тэй renderHook
//     const { result } = renderHook(() => useNavigation(), {
//       wrapper: ({ children }) => <NavigationProvider>{children}</NavigationProvider>,
//     });

//     // context буцааж байгаа эсэхийг шалгах
//     expect(result.current).toHaveProperty('openNavigation'); // жишээ
//     expect(result.current).toHaveProperty('closeNavigation'); // жишээ
//   });
// });
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavigationProvider, useNavigation } from '@/components/NavigationProvider/NavigationProvider';

describe('NavigationProvider', () => {
  it('useNavigation-г provider-гүй ашиглахад алдаа өгнө', () => {
    // console error-г suppression хийх
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty to suppress console errors during test
    });

    try {
      renderHook(() => useNavigation());
      // Хэрэв энд хүрвэл алдаа
      fail('Expected error was not thrown');
    } catch (error) {
      expect(error).toEqual(
        expect.objectContaining({
          message: 'useNavigation must be used within NavigationProvider',
        })
      );
    }

    consoleSpy.mockRestore();
  });

  it('useNavigation-г provider-тай ашиглахад зөв ажиллана', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <NavigationProvider>{children}</NavigationProvider>;

    const { result } = renderHook(() => useNavigation(), { wrapper });

    // Жинхэнэ property-уудыг шалгах
    expect(result.current).toHaveProperty('isSearchOpen');
    expect(result.current).toHaveProperty('setIsSearchOpen');
    expect(result.current).toHaveProperty('currentPage');
    expect(result.current).toHaveProperty('setCurrentPage');

    // Утгуудын төрлийг шалгах
    expect(typeof result.current.isSearchOpen).toBe('boolean');
    expect(typeof result.current.setIsSearchOpen).toBe('function');
    expect(typeof result.current.currentPage).toBe('string');
    expect(typeof result.current.setCurrentPage).toBe('function');
  });
});
