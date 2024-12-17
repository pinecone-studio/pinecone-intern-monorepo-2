import { MdOutlineDateRange } from 'react-icons/md';
import { GoTag } from 'react-icons/go';
import { IoMdTime } from 'react-icons/io';
import ApproveButton from './RequestApproveButton';
import DenyButton from './RequestDenyButton';

const RequestDetail = () => {
  return (
    <div className="flex flex-col w-[608px] bg-white border-[1px] border-[#E4E4E7] rounded-[8px] p-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Хүлээгдэж байна</div>
          <div className="text-xl font-semibold mt-1">B.Enkhjin</div>
        </div>
        <div>
          <div className="text-sm font-medium text-[#09090B] opacity-50">Хүсэлт явуулсан огноо:</div>
          <div className="mt-1 text-sm text-[#18181B] text-right">2024/08/26 10:45:03</div>
        </div>
      </div>
      <div className="mt-8 flex justify-between   ">
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <GoTag size={16} />
            <p>Ангилал</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">Чөлөө</div>
        </div>
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <MdOutlineDateRange size={16} />
            <p>Огноо</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">2024/10/25</div>
        </div>
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <IoMdTime size={16} />
            <p>Цаг</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">10:00-13:00</div>
        </div>
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <MdOutlineDateRange size={16} />
            <p>Нийт</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">1 хоног</div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t-[1px] border-[#E4E4E7]">
        <p className="text-sm text-[#71717A]">Чөлөө авах шалтгаан</p>
        <p className="mt-2 text-sm font-medium text-[#09090B]">Хотоос гарах ажил гарсан тул чөлөө олгоно уу.</p>
      </div>
      <div className="mt-8 flex justify-end gap-2">
        {/* <button className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#F4F4F5] text-[#18181B] text-sm font-medium">
          <GoX size={16} />
          Татгалзах
        </button> */}
        <DenyButton />
        {/* <button className="flex items-center gap-2 rounded-md px-4 py-2 bg-[#18181B] text-[#FAFAFA] text-sm font-medium">
                <GoCheck size={16} />
                Зөвшөөрөх
            </button> */}
        <ApproveButton />
      </div>
    </div>
  );
};

export default RequestDetail;
