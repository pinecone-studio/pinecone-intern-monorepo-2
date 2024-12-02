import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AlreadyHaveAnAcc = () => {
  return (
    <Card className="w-[350px] mx-auto border-none bg-white py-4">
      <CardContent className="flex items-center justify-center gap-2 p-0">
        <span className="text-sm">Have an account?</span>
        <Button variant="link" className="text-sm text-[#2563EB] p-0 h-auto font-semibold">
          Log in
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlreadyHaveAnAcc;
