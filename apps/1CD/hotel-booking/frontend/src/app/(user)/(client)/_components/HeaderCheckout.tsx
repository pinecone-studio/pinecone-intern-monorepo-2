'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/providers';

const HeaderCheckout = () => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className="flex justify-center w-screen p-6">
      <div className="flex justify-around w-full">
        <button
          className="flex gap-2"
          onClick={() => {
            router.push('/');
          }}
          data-cy="Home-Page-Button"
        >
          <div className="w-5 h-5 bg-[#013B94] rounded-full"></div>
          <p className="text-[#09090B]">Pedia</p>
        </button>
        {user ? (
          <div className="flex gap-4">
            <p className="text-sm font-medium text-[#09090B">My Booking</p>
            <p className="text-sm font-medium text-[#09090B">Shagai</p>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              className="text-sm font-medium text-[#09090B"
              onClick={() => {
                router.push('/signup');
              }}
              data-cy="Signup-Button"
            >
              Register
            </button>
            <button
              className="text-sm font-medium text-[#09090B"
              onClick={() => {
                router.push('/login');
              }}
              data-cy="Login-Button"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default HeaderCheckout;
