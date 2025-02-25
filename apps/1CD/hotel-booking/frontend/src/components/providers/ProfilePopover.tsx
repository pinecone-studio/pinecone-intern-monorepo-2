import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useAuth } from '.';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePopover = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { signout } = useAuth();

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/" alt="@shadcn" />
            <AvatarFallback className="text-blue-900">{user?.email.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid items-center grid-cols-3 gap-4 p-2 rounded-md hover:bg-slate-100">
                <button onClick={() => router.push('/profile')}>Profile</button>
              </div>
              <div className="grid items-center grid-cols-3 gap-4 p-2 rounded-md hover:bg-slate-100">
                <button onClick={signout}>Signout</button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfilePopover;
