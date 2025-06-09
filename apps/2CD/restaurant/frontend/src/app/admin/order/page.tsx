'use client';
import { Status } from '../_components/Status';
import { DatePickerDemo } from '../_components/DatePicker';
import { OrderInfo } from '../_components/OrderInfo';
import { Header } from '../_components/Header';
const Order = () => {
  return (
    <div>
      <Header />
      <div className="p-8 h-screen w-screen bg-[#F4F4F5] flex justify-center">
        <div className="w-4/12">
          <div className="flex flex-row justify-between">
            <p className="ml-2 text-black text-2xl font-semibold font-['GIP'] leading-7">Захиалга</p>
            <div className="flex flex-row gap-3">
              <div>
                <DatePickerDemo />
              </div>
              <Status />
            </div>
          </div>
          <div>
            <OrderInfo />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Order;
