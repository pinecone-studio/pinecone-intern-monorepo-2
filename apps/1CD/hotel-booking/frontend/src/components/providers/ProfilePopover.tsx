import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Maybe } from 'yup';
import { useAuth } from '.';
import { useRouter } from 'next/navigation';

const ProfilePopover = ({ firstName }: { firstName: Maybe<string> | undefined }) => {
  const router = useRouter();
  const { signout } = useAuth();

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">{firstName}</Button>
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
