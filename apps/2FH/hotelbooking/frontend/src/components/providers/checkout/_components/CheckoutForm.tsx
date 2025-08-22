import { BookingNumber } from './BookingNumber';
import { Preview } from './Preview';

export const CheckoutForm = () => {
  return (
    <div className="flex flex-col gap-16">
      <BookingNumber />
      <Preview />
    </div>
  );
};
