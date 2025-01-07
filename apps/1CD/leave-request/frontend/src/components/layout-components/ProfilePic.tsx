'use client';

import { Button } from '@/components/ui/button';
import { useFindUserByEmailQuery } from '@/generated';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';


export const ProfilePic = ({ email }: { email: string }) => {
  const { data } = useFindUserByEmailQuery({ variables: { email } });
  const router = useRouter()
  if (!data?.findUserByEmail?.profile) {
    return null;
  }

  const logOutClient = async () => {
    await fetch('/token', {method: "DELETE"})
    router.push('/login')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data.findUserByEmail.profile} alt="@shadcn" className="w-11 h-11 rounded-full" />
          <AvatarFallback>Z</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Button onClick={logOutClient} variant='destructive'>Log out</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
