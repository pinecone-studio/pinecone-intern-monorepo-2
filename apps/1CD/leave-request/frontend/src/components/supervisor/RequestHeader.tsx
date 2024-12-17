import DateRangeButton from './DateRangeButton';
import RequestCategory from './RequestCategory';
import { CiSearch } from 'react-icons/ci';

const RequestHeader = () => {
  return (
    <div className="flex flex-col bg-[#f4f4f5]">
      <h3 className="font-semibold text-xl leading-7">Хүсэлтүүд</h3>
      <div className="flex justify-between items-center mt-5">
        <div className="h-10 flex gap-3">
          <div className="flex gap-2 bg-white border-[1px] border-[#E4E4E7] items-center px-3 rounded-md">
            <CiSearch size={16} className="opacity-50" />
            <input type="text" placeholder="Хайлт" className="h-full text-[#71717A] text-sm leading-5" />
          </div>
          <RequestCategory />
        </div>
        <div>
          <DateRangeButton />
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
