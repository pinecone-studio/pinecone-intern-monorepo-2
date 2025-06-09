'use client';
import { useQuery, gql } from '@apollo/client';
import { FoodUpdate } from './FoodUpdate';
import { FoodDelete } from './FoodDelete';
import Image from 'next/image';
const GET_ALL_FOOD = gql`
  query GetAllFood {
    getAllFood {
      _id
      name
      price
      image
    }
  }
`;
export const FoodInfo = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_FOOD);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading food items: {error.message}</div>;
  return (
    <div className="self-stretch w-full h-auto mt-5 p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex flex-col justify-start items-end gap-0">
      {data.getAllFood.map((food: { _id: string; name: string; price: number; image: string }, idx: number) => (
        <div key={food._id} className="w-full">
          <div className="self-stretch w-full h-20 p-2.5 bg-white rounded-lg inline-flex flex-col justify-start items-end gap-4">
            <div className="self-stretch flex flex-col justify-center items-end gap-6">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="flex justify-start items-start gap-6">
                  <div className="self-stretch h-20 rounded-lg inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
                    <Image src={food.image} alt={food.image} className="self-stretch h-20" />
                  </div>
                  <div className="flex-1 h-20 inline-flex flex-col justify-center items-start gap-2">
                    <div className="justify-start text-base font-light font-['Inter'] leading-tight">{food.name}</div>
                    <div className="justify-start text-lg font-bold font-['Inter'] leading-tight">{food.price}</div>
                    <div className="px-2.5 py-0.5 rounded-md outline outline-1 outline-offset-[-1px] outline-border-border-border inline-flex justify-start items-start gap-2.5">
                      <div className="justify-start font-xs font-semibold font-['Inter'] leading-none">hi</div>
                    </div>
                  </div>
                </div>
                <div className="h-20 flex justify-end items-start gap-2">
                  <div className="w-9 h-9 px-4 py-2 relative bg-[#F4F4F5] rounded-md flex justify-center items-center gap-2 cursor-pointer overflow-hidden">
                    <div className="w-3.5 h-3.5 absolute left-[0px] top-[0px]">
                      <FoodUpdate food={food} onUpdated={refetch} />
                    </div>
                  </div>
                  <div className="w-9 h-9 px-4 py-2 relative bg-[#F4F4F5] rounded-md flex justify-center items-center gap-2 cursor-pointer overflow-hidden">
                    <div className="w-3.5 h-3.5 absolute left-[6px] top-[6px]">
                      <FoodDelete foodId={food._id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {idx < data.getAllFood.length - 1 && <div className="self-stretch h-px border border-[#E4E4E7] my-2 mt-[20px]" />}
        </div>
      ))}
    </div>
  );
};
