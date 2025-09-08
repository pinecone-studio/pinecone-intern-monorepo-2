import { DatePicker } from '@/components/date/Date';

export const HeroBanner = () => {
  return (
    <div className="relative w-full">
      <div className="bg-[#013B94] pt-10 pb-40 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Find the Best Hotel for Your Stay</h1>
          <p className="text-xl text-white mb-8">Book from a wide selection of hotels for your next trip.</p>

          <div className="flex justify-center ">
            <DatePicker />
          </div>
        </div>
      </div>
    </div>
  );
};
