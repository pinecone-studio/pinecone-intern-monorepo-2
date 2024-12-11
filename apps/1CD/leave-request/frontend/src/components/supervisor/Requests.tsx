// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Image from 'next/image';

import RequestHeader from "./RequestHeader";
import RequestList from "./RequestList";

const Requests = () => {
  return (
    <div className="flex flex-col bg-[#f4f4f5] mt-11">
        <div className="w-[1030px] mx-auto mt-10">
            <RequestHeader/>
            <div className="mt-5 flex gap-2">
                <RequestList/>
                <div>Detail</div>
            </div>
        </div>
        <div>@2024 Copyright</div>
    </div>
  );
};

export default Requests;
