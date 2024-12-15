// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { MdOutlineDateRange } from "react-icons/md";
import { GoTag } from "react-icons/go";
import { GoDotFill } from "react-icons/go";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";




const RequestList = () => {
  return (
    <div className="flex flex-col w-[414px]">
        <div className='flex flex-col gap-3'>
            <div className='flex px-4 py-3 justify-between bg-white border-[1px] border-[#E4E4E7] rounded-[8px]'>
                <div className='flex items-center'>
                    <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
                    <div className='text-xs text-[#71717A] ml-3'>
                        <div className='flex items-center gap-[6px]'>
                            <p className='text-sm text-[#09090B]'>B.Enkhjin</p>
                            <p className=''>3m</p>
                        </div>
                        <div className='flex mt-[6px] gap-[2px] items-center'>
                            <GoTag size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>Чөлөө</p>
                                <p>(1 цаг)</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-[2px] mt-1'>
                            <MdOutlineDateRange size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>2024/10/25</p>
                                <p>(9:00-11:00)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5'>Хүлээгдэж байна</div>
            </div>
            {/* map */}
            <div className='flex px-4 py-3 justify-between items-center'>
                <div className='flex items-center'>
                <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
                    <div className='text-xs text-[#09090B] ml-3'>
                        <div className='flex items-center gap-[6px]'>
                            <p className='text-sm text-[#09090B]'>N.Tumur</p>
                            <p className='text-[#2563EB]'>9m</p>
                        </div>
                        <div className='flex mt-[6px] gap-[2px] items-center'>
                            <GoTag size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>Чөлөө</p>
                                <p>(1 цаг)</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-[2px] mt-1'>
                            <MdOutlineDateRange size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>2024/10/25</p>
                                <p>(9:00-11:00)</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5'>Хүлээгдэж байна</div> */}
                <GoDotFill color='#2563EB'/>
            </div>
            <div className='flex px-4 py-3 justify-between'>
                <div className='flex items-center'>
                    <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
                    <div className='text-xs text-[#71717A] ml-3'>
                        <div className='flex items-center gap-[6px]'>
                            <p className='text-sm text-[#09090B]'>S.Iveel</p>
                            <p className=''>1h</p>
                        </div>
                        <div className='flex mt-[6px] gap-[2px] items-center'>
                            <GoTag size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>Чөлөө</p>
                                <p>(4 цаг)</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-[2px] mt-1'>
                            <MdOutlineDateRange size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>2024/10/25</p>
                                <p>(9:00-11:00)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-[#18BA51] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5'>Баталгаажсан</div>
            </div>
            <div className='flex px-4 py-3 justify-between'>
                <div className='flex items-center'>
                    <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
                    <div className='text-xs text-[#71717A] ml-3'>
                        <div className='flex items-center gap-[6px]'>
                            <p className='text-sm text-[#09090B]'>S.Togtokhbayar</p>
                            <p className=''>5d</p>
                        </div>
                        <div className='flex mt-[6px] gap-[2px] items-center'>
                            <GoTag size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>Зайнаас ажиллах</p>
                                <p>(1 хоног)</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-[2px] mt-1'>
                            <MdOutlineDateRange size={14}/>
                            <div className='flex gap-[2px]'>
                                <p>2024/08/19</p>
                                {/* <p>(9:00-11:00)</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-[#E11D48] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5'>Баталгаажсан</div>
            </div>
        </div>
        <div className='flex items-center gap-4 pt-4'>
            <p className='text-xs text-[#71717A]'>1-10 хүсэлт (Нийт: 20)</p>
            <div className='flex gap-4'>
                <FaAngleLeft size={8}/>
                <FaAngleRight size={8}/>
            </div>
        </div>
    </div>
  );
};

export default RequestList;
