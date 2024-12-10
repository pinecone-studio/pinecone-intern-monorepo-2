"use client"
import { useGetRoomsQuery } from '@/generated';
import HotelRoomCard from './HotelRoomCard';
const HomeHotelDetail = () => {
    const { data} = useGetRoomsQuery({variables: {hotelId: '674e7578b242c9e3bd9017d7'}});
    console.log(data?.getRooms)
    return (
        <div data-cy="HomeHotellDetail">
            <div className="grid grid-cols-3 gap-4">
                {data?.getRooms.map((room) => (
                    <div key={room._id}>
                        <HotelRoomCard room={room}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default HomeHotelDetail;