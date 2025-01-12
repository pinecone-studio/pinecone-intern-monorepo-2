'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { capitalize } from 'src/utils/capitalize';
import { ChevronRight } from 'lucide-react';

const envs = ['development', 'testing', 'production'];

type Params = {
  project: string;
};

const Page = () => {
  const { project } = useParams<Params>();
  const router = useRouter();

  const handleClick = (env: string) => () => {
    router.push(`/${project}/${env}`);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {envs.map((env) => (
        <Button variant="outline" key={env} className="p-4 h-fit" onClick={handleClick(env)}>
          <div className="flex items-center justify-between w-full">
            <p className="text-lg font-semibold">{capitalize(env)}</p>

            <ChevronRight />
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Page;
