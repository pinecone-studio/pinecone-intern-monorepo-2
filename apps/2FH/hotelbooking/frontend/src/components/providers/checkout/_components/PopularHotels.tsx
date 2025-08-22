import { HotelCard } from '@/components/HotelCard';
import { Hotel } from '@/types/hotel';

type PopularHotelsProps = {
  hotels: Hotel[];
  loading: boolean;
  error: Error | null;
};
export const PopularHotels = ({ hotels, loading, error }: PopularHotelsProps) => {
  return (
    <section className="py-12 lg:px-80">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View all</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">Error loading hotels: {error.message}</p>
            <p className="text-sm text-red-500 mt-1">Please check your GraphQL server connection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
