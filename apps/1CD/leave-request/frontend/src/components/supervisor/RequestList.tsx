// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { MdOutlineDateRange } from "react-icons/md";
import { GoTag } from "react-icons/go";



const RequestList = () => {
  return (
    <div className="flex flex-col w-[414px] gap-3">
        <div className='flex px-4 py-3 items-center'>
            <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
            <div>
                <div className='flex'>
                    <p>B.Enkhjin</p>
                    <p>3m</p>
                </div>
                <div className='flex'>
                    <GoTag />
                    <div className='flex'>
                        <p>Чөлөө</p>
                        <p>(1 цаг)</p>
                    </div>
                </div>
                <div className='flex'>
                    <MdOutlineDateRange />
                    <div className='flex'>
                        <p>2024/10/25</p>
                        <p>(9:00-11:00)</p>
                    </div>
                </div>
            </div>
            <div>Хүлээгдэж байна</div>
        </div>
    </div>
  );
};

export default RequestList;
