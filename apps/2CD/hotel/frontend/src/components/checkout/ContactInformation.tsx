import { Input } from '@/components/ui/input';

const ContactInformation = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-[20px] font-bold">2. Contact Information</p>
        <p className="text-[14px]">Email Address</p>
        <Input />
        <p className="text-[14px] text-gray-500">Your confirmation email goes here</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Phone Number</p>
        <Input />
      </div>
    </>
  );
};

export default ContactInformation;
