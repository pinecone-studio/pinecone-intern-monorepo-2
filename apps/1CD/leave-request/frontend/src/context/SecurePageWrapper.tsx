'use client';

import { useRouter } from 'next/navigation';
import { useCheckMeQuery } from '@/generated';
import { useEffect, useState } from 'react';

export const SecureWrapper = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { data, loading } = useCheckMeQuery({ variables: { roles } });
  const router = useRouter();
  if (loading) {
    return (
      <div className="w-[100%] h-[100vh] flex justify-center items-center fixed inset-0">
        <Loader />
      </div>
    );
  }
  if (!data?.checkMe?.res) {
    router.push('/login');
    return null;
  }
  return (
    <>
      {children}
    </>
  );
};

export const Loader = () => {
  const [mc, setMc] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMc((prevMc) => {
        if (prevMc >= 11 && direction > 0) {
          setDirection(-1);
          return prevMc - 1;
        } else if (prevMc <= 0 && direction < 0) {
          setDirection(1);
          return prevMc + 1;
        }
        return prevMc + direction;
      });
    }, 100);

  
    return () => clearInterval(interval); 
  }, [direction]); 
  return (
    <div className="w-100 h-10 rounded-full flex justify-center items-center gap-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className={`bg-slate-950 w-2 transition-all duration-100 ${mc === index ? 'h-10' : 'h-2'}`} key={`bar${index}`}></div>
      ))}
    </div>
  );
};
