'use client';

import { buttonVariants } from '@/components/ui/button';

const SubmitButton = () => {
  return (
    <div className="pb-16 pt-6">
      <button
        type="submit"
        className={`${buttonVariants({
          variant: 'default',
        })} bg-[#E11D48] text-white font-bold px-10 py-3 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded`}
        style={{ textTransform: 'none' }}
      >
        Update profile
      </button>
    </div>
  );
};

export default SubmitButton;
