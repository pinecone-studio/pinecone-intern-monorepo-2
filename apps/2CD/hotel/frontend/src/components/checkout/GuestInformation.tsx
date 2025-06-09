import { Input } from '@/components/ui/input';

const GuestInformation = () => {
  return (
    <div className="flex justify-between flex-col gap-7">
      <div className="flex flex-col gap-2">
        <p className="text-[20px] font-bold">1. Who&apos;s checking in?</p>
        <p className="text-[14px] text-gray-500">
          Please tell us the name of the guest staying at the hotel as it appears on the ID that they&apos;ll present at check-in. If the guest has more than one last name, please enter them all.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">First Name</p>
        <Input />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-[14px]">Middle Name</p> <p className="text-[14px] text-gray-500">(Optional)</p>
        </div>
        <Input />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Last Name</p>
        <Input />
      </div>
    </div>
  );
};

export default GuestInformation;
