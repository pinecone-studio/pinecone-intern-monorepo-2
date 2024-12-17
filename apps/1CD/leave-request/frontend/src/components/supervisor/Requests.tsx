// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Image from 'next/image';

import RequestDetail from "./RequestDetail";
import RequestHeader from "./RequestHeader";
import RequestList from "./RequestList";

const Requests = () => {
  return (
    <div className="flex flex-col bg-[#f4f4f5] mt-11">
        <div className="w-[1030px] mx-auto mt-10">
            <RequestHeader/>
            <div className="mt-5 flex gap-2">
                <RequestList/>
                <RequestDetail/>
            </div>
        </div>
        <div className="h-[60px] w-full bg-[#f4f4f5] flex items-center justify-center text-sm text-[#3F4145] mt-[44px]">©2024 Copyright</div>
    </div>
  );
};

export default Requests;
