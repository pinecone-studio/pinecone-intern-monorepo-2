'use client';
import { useRouter } from 'next/navigation';

const Contentcontainer = () => {
  const router = useRouter();

  const handleAddHotel = () => {
    router.push('/admin/add-hotel');
  };

  return (
    <div className="p-4 border-t flex items-center justify-between space-x-2">
      <h3 className="text-[#020617] font-semibold text-2xl">Hotels</h3>
      <button
        onClick={handleAddHotel}
        className="bg-[#2563EB] text-white font-medium w-[155px] text-sm px-4 py-2 rounded hover:bg-[#1d4ed8] transition-colors"
      >
        + Add Hotel
      </button>
    </div>
  );
};

export default Contentcontainer;