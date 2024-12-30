'use client';

import { useGetAllRequestsBySupervisorQuery } from '@/generated';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Image from 'next/image';

import RequestDetail from './RequestDetail';
import RequestHeader from './RequestHeader';
import RequestList from './RequestList';
import { useRef, useState } from 'react';
import { addDays } from 'date-fns';

interface filterProps {
  status?: string[];
  startDate: Date;
  endDate: Date;
  search?: string;
}


const Requests = ({ email }: { email: string }) => {
  const filter = useRef<filterProps>({ endDate: new Date(), startDate: addDays(new Date(), -30) })
  const [page, setPage] = useState(1)
  const { data, loading, refetch } = useGetAllRequestsBySupervisorQuery({ variables: { supervisorEmail: email, ...filter, page} });

  if (loading) {
    return <>loading</>;
  }

  const { getAllRequestsBySupervisor, getAllRequestLength } = data!;
  return (
    <div className="flex flex-col bg-[#f4f4f5] mt-11">
      <div className="w-[1030px] mx-auto mt-10">
        <RequestHeader onChange={(arg) => {refetch(arg)}}/>
        <div className="mt-5 flex gap-2">
          <RequestList data={getAllRequestsBySupervisor} length={getAllRequestLength} pageChange={setPage} page={page} />
          <RequestDetail />
        </div>
      </div>
      <div className="h-[60px] w-full bg-[#f4f4f5] flex items-center justify-center text-sm text-[#3F4145] mt-[44px]">©2024 Copyright</div>
    </div>
  );
};

export default Requests;
