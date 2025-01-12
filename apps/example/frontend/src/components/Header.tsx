'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from './providers';

export const Header = () => {
  const { user, signout } = useAuth();

  return (
    <div className="z-10 flex justify-between px-8 py-4 text-white bg-black mb-14">
      <div className="flex items-center gap-4">
        <Link href="/">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.11038 4.76864L0.806264 12.8247C0.269142 13.833 0 14.9395 0 16.0476C0 17.1557 0.269142 18.2621 0.806264 19.2704L5.11038 27.3266C5.9037 28.8147 7.45516 29.744 9.14352 29.744H13.7153V27.4619H13.7138C12.8704 27.4619 12.0946 26.9978 11.6979 26.2539L7.39543 18.1961C7.03585 17.5245 6.85665 16.7868 6.85665 16.0476C6.85665 15.3083 7.03585 14.5706 7.39543 13.8991L11.6979 5.84136C12.0946 5.09726 12.8704 4.63341 13.7138 4.63341H13.7153V2.35107H9.14352C7.45516 2.35107 5.9037 3.28061 5.11038 4.76864Z"
              fill="white"
            />
            <path
              d="M31.1937 12.8248L26.8898 4.7687C26.0963 3.28051 24.545 2.35113 22.8567 2.35113H18.2847V4.6333H18.2864C19.1298 4.6333 19.9055 5.09732 20.3021 5.84125L24.6046 13.899C24.9643 14.5707 25.1432 15.3083 25.1432 16.0476C25.1432 16.7869 24.9643 17.5245 24.6046 18.1962L20.3021 26.2538C19.9055 26.9979 19.1298 27.4618 18.2864 27.4618H18.2847V29.7441H22.8567C24.545 29.7441 26.0963 28.8147 26.8898 27.3265L31.1937 19.2704C31.7307 18.2622 32 17.1556 32 16.0476C32 14.9396 31.7307 13.8331 31.1937 12.8248Z"
              fill="white"
            />
          </svg>
        </Link>
        {/* <Link href="/category">Бүтээгдэхүүн</Link> */}
      </div>

      {!user && (
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <Button>Нэвтрэх</Button>
          </Link>

          <Link href="/signup">
            <Button>Бүртгүүлэх</Button>
          </Link>
        </div>
      )}

      {user && (
        <div className="flex items-center gap-4">
          <Button onClick={signout}>Гарах</Button>
        </div>
      )}
    </div>
  );
};
