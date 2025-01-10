'use client';
import React, { useEffect, useState } from 'react';
import { useGetUsersQuery, User } from '@/generated';
import StackImgs from './StackImg';
import Swiping from './Swiping';
import Image from 'next/image';

const Swiper = () => {
  const { data } = useGetUsersQuery();
  const [cards, setCards] = useState<User[]>([]);
  const [swiping, setSwiping] = useState<User>();


  useEffect(() => {
    if (data?.getUsers) {
      setSwiping(data.getUsers[0]);
      setCards(data.getUsers.slice(1, data.getUsers.length));
    }
  }, [data?.getUsers]);

  if (swiping === undefined) return;
  <div className="flex items-center justify-center h-screen">
    <Image src="/loading.svg" width={40} height={40} alt="loading" />
  </div>;

  return (
    <div>
      <div className="relative flex justify-center mt-4">
        <StackImgs cards={cards} />
        <Swiping cards={cards} setSwiping={setSwiping} swiping={swiping} setCards={setCards} />
      </div>
    </div>
  );
};

export default Swiper;
