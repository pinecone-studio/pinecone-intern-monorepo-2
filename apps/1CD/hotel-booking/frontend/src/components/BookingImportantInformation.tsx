const BookingImportantInformation = () => {
  return (
    <div data-cy="Booking-Important-Information" className="text-[#09090B] flex flex-col gap-4">
      <div className="text-xl">Important information</div>

      <ul className="list-disc">
        <li className="ml-4">
          Guests must contact the property in advance for check-in instructions; front desk staff will greet guests on arrival. To make arrangements for check-in please contact the property ahead of
          time using the information on the booking confirmation. If you are planning to arrive after 3:30 PM please contact the property in advance using the information on the booking confirmation.
        </li>
      </ul>

      <div>
        By clicking on the button below, I confirm I have read the <span className="text-blue-500 underline decoration-blue-500">Privacy Statement</span> and
        <span className="text-blue-500 underline decoration-blue-500">Government Travel Advice</span>, and have read and accept the
        <span className="text-blue-500 underline decoration-blue-500">Rules & Restrictions</span> and <span className="text-blue-500 underline decoration-blue-500">Terms of Service.</span>
      </div>
    </div>
  );
};

export default BookingImportantInformation;
