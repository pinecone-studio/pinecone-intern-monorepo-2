'use client';

import { MdOutlineDateRange } from 'react-icons/md';
import { GoTag } from 'react-icons/go';
import { IoMdTime } from 'react-icons/io';
import ApproveButton from './RequestApproveButton';
import DenyButton from './RequestDenyButton';
import { useSearchParams } from 'next/navigation';
import { useOpenRequestQuery } from '@/generated';
import { format } from 'date-fns';
import { Pin, RequestType } from './RequestList';
import { Loader } from '@/context/SecurePageWrapper';

// eslint-disable-next-line complexity
const RequestDetail = () => {
  const params = useSearchParams();
  const id = params.get('id') || '';
  const { data, loading, refetch } = useOpenRequestQuery({
    variables: { id },
  });

  const reload = () => {
    refetch({ id });
  };

  if (!id) {
    return <div className=' max-h-[371px] max-w-[608px] w-full items-center flex justify-center'>Хүсэлтэн дээр даран хариу өгөх боломжтой</div>;
  }
  if (loading) {
    return <div className=' max-h-[371px] w-full max-w-[608px] items-center flex justify-center'><Loader/></div>;
  }

  const { openRequest } = data!;
  if (!openRequest) return null;
  return (
    <div className="flex flex-col w-[608px] bg-white border-[1px] border-[#E4E4E7] rounded-[8px] p-8">
      <div className="flex justify-between items-center">
        <div className="flex items-start flex-col">
          <Pin result={openRequest?.result} />
          <div className="text-xl font-semibold mt-1">{openRequest?.userName}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-[#09090B] opacity-50">Хүсэлт явуулсан огноо:</div>
          <div className="mt-1 text-sm text-[#18181B] text-right">{format(openRequest?.createdAt, 'yyyy/MM/dd HH:MM:SS')}</div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <GoTag size={16} />
            <p>Ангилал</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">{RequestType(openRequest)}</div>
        </div>
        <div>
          <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
            <MdOutlineDateRange size={16} />
            <p>Огноо</p>
          </div>
          <div className="text-sm text-[#09090B] font-medium mt-2">{format(openRequest.requestDate, 'yyyy/MM/dd')}</div>
        </div>
        {openRequest.startTime && (
          <div>
            <div className="flex text-xs text-[#71717A] font-medium gap-2 items-center">
              <IoMdTime size={16} />
              <p>Цаг</p>
            </div>
            <div className="text-sm text-[#09090B] font-medium mt-2">
              {openRequest.startTime}-{openRequest.endTime}
            </div>
          </div>
        )}
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
        <p className="mt-2 text-sm font-medium text-[#09090B]">{openRequest?.message}</p>
      </div>
      {openRequest.result == 'sent' ||
        (openRequest.result == 'pending' && (
          <div className="mt-8 flex justify-end gap-2">
            <DenyButton id={id} refetch={reload}/>

            <ApproveButton id={id} refetch={reload}/>
          </div>
        ))}
    </div>
  );
};

export default RequestDetail;
