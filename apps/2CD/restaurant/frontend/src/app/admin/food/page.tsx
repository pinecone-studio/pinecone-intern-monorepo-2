'use client';
import { AddFoodButton } from '../_components/AddFoodButton';
import { FoodInfo } from '../_components/FoodInfo';
import { Header } from '../_components/Header';
const Food = () => {
  return (
    <div>
      <Header />
      <div className="p-8 h-screen w-screen bg-[#F4F4F5] flex justify-center">
        <div className="w-4/12">
          <div className="flex flex-row justify-between">
            <p className="ml-2 text-black text-3xl font-semibold font-['GIP'] leading-7">Хоол</p>
            <div className="flex flex-row gap-3">
              <AddFoodButton />
            </div>
          </div>
          <div>
            <FoodInfo />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Food;
