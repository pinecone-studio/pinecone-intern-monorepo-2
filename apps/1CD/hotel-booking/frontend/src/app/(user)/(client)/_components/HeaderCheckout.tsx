'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/providers';

const HeaderCheckout = () => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className="flex flex-col max-w-full gap-4">
      <div className="py-4 bg-background">
        <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-[#013B94] rounded-full"></div>
            <p className="text-[#09090B]">Pedia</p>
          </div>
          {user ? (
            <div className="flex gap-4">
              <button className="text-sm font-medium text-[#09090B">My Booking</button>
              <button className="text-sm font-medium text-[#09090B">Shagai</button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="text-sm font-medium text-[#09090B"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Register
              </button>
              <button
                className="text-sm font-medium text-[#09090B"
                onClick={() => {
                  router.push('/login');
                }}
              >
                Sign in
              </button>
            </div>
          )}
          <div className="flex gap-4"></div>
        </div>
      </div>
    </div>
  );
};
export default HeaderCheckout;
