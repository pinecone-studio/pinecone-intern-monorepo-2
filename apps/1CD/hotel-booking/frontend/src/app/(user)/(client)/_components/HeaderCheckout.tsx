'use client';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';

const HeaderCheckout = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col max-w-full gap-4">
      <div className="py-4 bg-background">
        <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
          <button className="flex gap-2" onClick={() => router.push('/')} data-cy="Home-Button">
            <div className="w-5 h-5 bg-[#013B94] rounded-full"></div>
            <p className="text-[#09090B]">Pedia</p>
          </button>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-[#09090B]" onClick={() => router.push('/booking')}>
              My Booking
            </button>
            <button className="text-sm font-medium text-[#09090B]">{user.firstName ? user.firstName : user.email}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCheckout;
