'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar1, Tag } from 'lucide-react';
import { ClientDatePicker } from './DatePicker';

type RequestThatIsent = {
  MongolDate: string;
  Date: String;
  description: string;
  status: string;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  yearDate: string;
};
const RequestThatIsent = ({ Date, description, icon1, MongolDate, status, icon2, yearDate }: RequestThatIsent) => {
  return (
    <div className="w-[684px] ">
      <div className="flex gap-2 mb-1">
        <h1 className="font-bold">{Date}</h1>
        <p className=" text-[#71717A]">{MongolDate}</p>
      </div>
      <div className="bg-white p-6 mb-4 rounded-md">
        <div className="flex gap-3 ml-1">
          <div className=" text-sm">{icon1 && <div className="text-sm">{icon1}</div>}</div>
          <div>{description}</div>
          <div className="rounded-full bg-[#F9731633] p-2 text-sm">{status}</div>
        </div>
        <div className="flex gap-2 ml-1">
          <div className=" text-sm">{icon2 && <div className="text-sm">{icon2}</div>}</div>
          <div>{yearDate}</div>
        </div>
      </div>
    </div>
  );
};

const SentRequest = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);

  const ToggleCalendar = () => {
    setCalendarVisible((prevState) => !prevState);
  };
  return (
    <>
      <div className="w-[684PX] bg-[#F4F4F5] mx-auto pt-10">
        <div>
          <h1 className="font-bold text-2xl">Миний явуулсан хүсэлтүүд:</h1>
          <div className="mt-6 flex justify-between">
            <ClientDatePicker />
            <Button> + Чөлөө хүсэх</Button>
          </div>
        </div>
        <div className="py-6 rounded-lg text=[#71717A]">
          <RequestThatIsent Date="10/15" MongolDate="Өнөөдөр" description="Чөлөө (1 хоног)" status="Хүлээгдэж байна." icon1={<Tag size={14} color='#71717A'/>} icon2={<Calendar1 size={14} color='#71717A'/>} yearDate="2024/10/25" />
          <RequestThatIsent Date="10/15" MongolDate="Өнөөдөр" description="Чөлөө (1 хоног)" status="Хүлээгдэж байна." icon1={<Tag size={14} color='#71717A' />} icon2={<Calendar1 size={14} color='#71717A'/>} yearDate="2024/10/25" />
          <RequestThatIsent Date="10/15" MongolDate="Өнөөдөр" description="Чөлөө (1 хоног)" status="Хүлээгдэж байна." icon1={<Tag size={14} color='#71717A'/>} icon2={<Calendar1 size={14} color='#71717A'/>} yearDate="2024/10/25" />
          <RequestThatIsent Date="10/15" MongolDate="Өнөөдөр" description="Чөлөө (1 хоног)" status="Хүлээгдэж байна." icon1={<Tag size={14} color='#71717A'/>} icon2={<Calendar1 size={14} color='#71717A'/>} yearDate="2024/10/25" />
          <RequestThatIsent description="Чөлөө (1 хоног)" status={"Хүлээгдэж байна."} icon1={<Tag size={14} />} icon2={<Calendar1 size={14} color='#71717A' />} yearDate="2024/10/25" MongolDate={''} Date={undefined} />
        </div>
      </div>
    </>
  );
};

export default SentRequest;
