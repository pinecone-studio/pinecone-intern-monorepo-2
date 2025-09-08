import { HotelInfo } from '@/components';

const HotelDetailPage = () => {
  return (
    <div data-cy="hotel-detail-page" className="flex flex-col w-screen ">
      <HotelInfo />
    </div>
  );
};

export default HotelDetailPage;
