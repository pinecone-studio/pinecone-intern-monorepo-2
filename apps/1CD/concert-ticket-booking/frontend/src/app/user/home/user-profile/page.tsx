'use client';

import React, { useState } from 'react';
import UserInfo from './_components/UserInfo';
import PasswordReset from './_components/PasswordReset';
import OrderInfo from './_components/OrderInfo';

const UserInfoPage = () => {
  const [state, setState] = useState(1);

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-black justify-center px-4 py-6" data-cy="User-Info-Comp">
      <div className="gap-10 my-12 lg:flex sm:max-w-flex sm:max-w-flex-col">
        <div className="text-white bg-black w-[235px] py-2 flex flex-col gap-2 items-start">
          <button
            data-cy="info-state-button"
            className="bg-[#09090B]  w-full text-start text-white py-2 px-4 rounded-md border border-transparent hover:bg-[#111112] focus:outline-none focus:ring-2 focus:ring-[#09090B] transition-all duration-300"
            onClick={() => setState(1)}
          >
            Хэрэглэгчийн мэдээлэл
          </button>
          <button
            data-cy="order-state-button"
            className="bg-transparent w-full text-start text-white py-2 px-4 rounded-md hover:bg-[#09090B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#09090B] transition-all duration-300"
            onClick={() => setState(2)}
          >
            Захиалгын түүх
          </button>
          <button
            data-cy="password-state-button"
            className="bg-transparent w-full text-start text-white py-2 px-4 rounded-md hover:bg-[#09090B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#09090B] transition-all duration-300"
            onClick={() => setState(3)}
          >
            Нууц үг сэргээх
          </button>
        </div>
        <div>
          {state === 1 && <UserInfo />}
          {state === 2 && <OrderInfo />}
          {state === 3 && <PasswordReset />}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;

