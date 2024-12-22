"use client"

import { useRouter } from 'next/navigation';
import { useCheckMeQuery } from '@/generated';

export const SecureWrapper = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { data, loading } = useCheckMeQuery({ variables: { roles } });
  const router = useRouter();
  if (loading) {
    return <>loading</>;
  }
  if (!data?.checkMe?.res) {
    router.push('/login')
    return null;
  }
  return <div>{children}</div>;
};
