import '../.././global.css';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/providers/Header';
import { PropsWithChildren, Suspense } from 'react';
import { Toaster } from 'sonner';
// type DateRangeContextType = {
//   date: DateRange | undefined;
//   setDate: Dispatch<SetStateAction<DateRange | undefined>>;
//   roomType: string;
//   setRoomType: Dispatch<SetStateAction<string>>;
// } | null;

const PublicLayout = ({ children }: PropsWithChildren) => {
  // const [date, setDate] = useState<DateRange | undefined>();
  // const [roomType, setRoomType] = useState('');
  return (
    <>
      {/* <Context.Provider value={{ date, setDate, roomType, setRoomType }}> */}
      <Suspense>
        <Header />
        <Toaster />
        {children}
        <FooterHome />
      </Suspense>
      {/* </Context.Provider> */}
    </>
  );
};

export default PublicLayout;
