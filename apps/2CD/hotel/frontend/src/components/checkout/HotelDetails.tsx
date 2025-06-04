import Image from 'next/image';

interface HotelDetailsProps {
  hotelName: string;
  address: string;
  postalCode: string;
  rating: number;
  ratingText: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  roomFeatures: string[];
  pricePerNight: number;
  totalPrice: number;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotelName, address, postalCode, rating, ratingText, checkInDate, checkOutDate, roomType, roomFeatures, pricePerNight, totalPrice }) => {
  return (
    <div className="w-[50%] flex flex-col p-6">
      <div className="flex flex-col border rounded-lg shadow-sm">
        <div className="w-full h-[240px] relative rounded-t-lg overflow-hidden">
          <Image 
            src="/images/flower-hotel.jpg" 
            alt={hotelName} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-6 bg-white p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{hotelName}</h2>
            <p className="text-gray-600">{address}</p>
            <p className="text-gray-600">{postalCode}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">{rating}</span>
              <span className="font-medium">{ratingText}</span>
            </div>
          </div>

          <div className="border-t border-b py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Check in</p>
              <p>{checkInDate}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Check out</p>
              <p>{checkOutDate}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{roomType}</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {roomFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Price Detail</h3>
            <div className="flex justify-between text-gray-600">
              <span>1 room x 1 night</span>
              <span>USD {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Rate per night</span>
              <span>${pricePerNight.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-4 text-lg">
              <span>Total price</span>
              <span>USD {totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
