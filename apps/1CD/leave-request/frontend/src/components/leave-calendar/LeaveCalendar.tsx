import { useRef } from 'react';
import { DatePickerLeave } from './DatePickerLeave';
import { addDays } from 'date-fns';

const AcceptedRequest = () => {
      const dateRange = useRef({
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      });
    //   const refresh = async () => {
    //     await refetch({ email, ...dateRange.current });
    //   };
  return (
    <>
      <div>
        <h1>Чөлөө авсан:</h1>
        <DatePickerLeave onChange={(e) => {
            if (e?.to && e?.from) {
              dateRange.current = { startDate: e?.from, endDate: e?.to };
            //   refresh();
            }
          }} />
      </div>
    </>
  );
};
export default AcceptedRequest;
