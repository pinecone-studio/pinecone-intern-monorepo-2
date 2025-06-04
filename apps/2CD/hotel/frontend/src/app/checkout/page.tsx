import Header from '../../components/header/Header';
import FooterCheckIn from '../../components/footer/footer-check-in';
import HotelDetails from '@/components/checkout/HotelDetails';
import GuestInformation from '@/components/checkout/GuestInformation';
import ContactInformation from '@/components/checkout/ContactInformation';
import PaymentDetails from '@/components/checkout/PaymentDetails';

const CheckOut = () => {
  const hotelDetails = {
    hotelName: "Flower Hotel Ulaanbaatar",
    address: "Zaluuchuud Avenue, 18, Bayanzurkh",
    postalCode: "Ulaanbaatar, 001334",
    rating: 8.6,
    ratingText: "Excellent",
    checkInDate: "Monday, Jul 1, 3:00pm",
    checkOutDate: "Tuesday, Jul 3, 11:00am",
    roomType: "Standard Room, City View",
    roomFeatures: [
      "1 Queen Bed",
      "Non Smoking",
      "Breakfast included",
      "Pet friendly"
    ],
    pricePerNight: 78.30,
    totalPrice: 81.00
  };

  return (
    <>
      <Header />
      <div className="w-full flex justify-center">
        <div className="w-[1280px] flex flex-row justify-between mb-16">
          <div className="w-[50%] flex flex-col gap-7">
            <GuestInformation />
            <ContactInformation />
            <PaymentDetails />
          </div>
          <HotelDetails {...hotelDetails} />
        </div>
      </div>
      <FooterCheckIn />
    </>
  );
};
export default CheckOut;
