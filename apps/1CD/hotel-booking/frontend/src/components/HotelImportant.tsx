const HotelImportant = () => {
  return (
    <div className="flex flex-col gap-20 md:flex-row">
      <div className="w-[264px]">
        <h3 className="text-2xl font-semibold">Important information</h3>
      </div>
      <div className="flex flex-col flex-1 gap-10">
        <div className="flex flex-col flex-1 gap-2">
          <ul className="text-xl font-semibold text-[#09090B]">Optional extras</ul>
          <li className="text-sm font-normal text-[#09090B]">Fee for buffet breakfast: approximately USD 20 for adults and USD 10 for children</li>
          <li>Airport shuttle fee: USD 65.00 per vehicle (roundtrip)</li>
          <p className="text-sm font-normal text-[#09090B]">The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">You need to know</h4>
          <p className="text-sm font-normal">Extra-person charges may apply and vary depending on property policy</p>
          <p className="text-sm font-normal">Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</p>
          <p className="text-sm font-normal">Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</p>
          <p className="text-sm font-normal">This property accepts credit cards and cash</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">We should mention</h4>
          <p className="text-sm font-normal">No pets and no service animals are allowed at this property</p>
        </div>
      </div>
    </div>
  );
};
export default HotelImportant;
