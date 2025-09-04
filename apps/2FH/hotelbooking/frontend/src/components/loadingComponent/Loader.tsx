'use client';

export const HotelLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="flex gap-[5px] bg-transparent items-center">
        <div className="p-3 bg-[#013B94] rounded-full"></div>
        <div className="text-black text-[24px]">Pedia</div>
      </div>
      <div role="status" className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

      <p className="text-lg font-medium text-gray-600">Please Wait...</p>
    </div>
  );
};
