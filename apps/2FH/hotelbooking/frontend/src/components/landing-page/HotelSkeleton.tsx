export const HotelSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>

      <div className="p-4">
        <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>

        <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>

        <div className="flex items-center mb-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="ml-2 h-4 bg-gray-300 rounded w-16"></div>
        </div>

        <div className="space-y-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="h-8 bg-gray-300 rounded-full w-20"></div>
      </div>
    </div>
  );
};

export const HotelSkeletonGrid = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <HotelSkeleton key={i} />
      ))}
    </div>
  );
};

export const HotelSkeletonHorizontal = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <HotelSkeleton key={i} />
      ))}
    </div>
  );
};
