export const PriceDetail = () => {
  return (
    <div className="p-[16px] flex flex-col gap-3">
      <div>Price Detail</div>
      <div>
        <div className="flex items-center justify-between">
          <div>1 room x 1 night</div>
          <div>USD 81.00</div>
        </div>
        <div className="text-[12px] opacity-50">$78.30 per night</div>
      </div>
      <div className="border-[1px] w-full opacity-50"></div>
      <div className="flex justify-between p-4">
        <div>Total price</div>
        <div className="font-semibold">USD 81.00</div>
      </div>
    </div>
  );
};
