import { Heart } from 'lucide-react';
import Image from 'next/image';

const NoNotification = () => {
  return (
    <div className="flex flex-col items-center text-slate-500">
      <div>
        <section className="relative flex items-center justify-center w-12 h-12 mb-5 border-2 rounded-full border-slate-500">
          <Heart />
        </section>
      </div>
      <h1 className="mb-1 font-medium">Activity On Your Posts</h1>
      <p className="text-center">When someone likes or comments on one of your posts, you’ll see it here.</p>
    </div>
  );
};
export default NoNotification;
