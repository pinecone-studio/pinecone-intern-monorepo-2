import HotelDetail from '../../../(client)/_components/HotelDetail';

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <HotelDetail id={params.id} />
    </div>
  );
};
export default Page;
