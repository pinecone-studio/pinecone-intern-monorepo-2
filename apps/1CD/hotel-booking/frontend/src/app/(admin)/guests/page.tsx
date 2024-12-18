import { SidebarTrigger } from '@/components/ui/sidebar';

import { Input } from '@/components/ui/input';

import DataTable from './_components/DataTable';
import StatusSelect from './_components/Select';

const Page = () => {
  return (
    <section className="w-screen bg-gray-50">
      <SidebarTrigger />
      <section className="flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Guests</h2>
          <div className="flex gap-3">
            <Input className="max-w-[1400px] bg-white" placeholder="Search" />
            <StatusSelect />
          </div>
        </div>
        <DataTable />
      </section>
    </section>
  );
};

export default Page;
