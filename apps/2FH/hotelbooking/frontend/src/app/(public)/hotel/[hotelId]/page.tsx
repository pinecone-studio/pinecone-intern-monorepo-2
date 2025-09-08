import { HotelInfo } from '@/components';
import { DatePicker } from '@/components/date/Date';

const HotelDetailPage = () => {
  return (
    <div data-cy="hotel-detail-page" className="flex flex-col w-screen">
      <div className="bg-[#013B94] pt-10 pb-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Book Your Stay</h1>
          <div className="flex justify-center">
            <DatePicker />
          </div>
        </div>
      </div>

      <HotelInfo />
    </div>
  );
};

export default HotelDetailPage;
