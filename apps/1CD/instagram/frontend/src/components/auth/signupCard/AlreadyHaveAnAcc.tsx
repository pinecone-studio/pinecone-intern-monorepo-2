'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const AlreadyHaveAnAcc = () => {
  const router = useRouter();
  return (
    <Card className="w-[350px] mx-auto border-none bg-white py-4" data-testid="card-btn">
      <CardContent className="flex items-center justify-center gap-2 p-0">
        <span className="text-sm">Have an account?</span>

        <Button
          variant="link"
          data-testid="push-login-lage-btn"
          className="text-sm text-[#2563EB] p-0 h-auto font-semibold"
          onClick={() => {
            router.push('/');
          }}
        >
          Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlreadyHaveAnAcc;
