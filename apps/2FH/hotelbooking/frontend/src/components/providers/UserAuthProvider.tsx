'use client';
import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
type BookingDataType = {
  userId: string;
  id: string;
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  __typeName: string;
};
type OtpContextType = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  resetOtp: () => void;
  timeLeft: number;
  startTime: boolean;
  setStartTime: Dispatch<SetStateAction<boolean>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  bookingSuccess: boolean;
  setBookingSuccess: Dispatch<SetStateAction<boolean>>;
  bookingData: BookingDataType;
  setBookingData: Dispatch<SetStateAction<BookingDataType>>;
  me: any; // later replace with proper User type
  setMe: Dispatch<SetStateAction<any>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  adult: number;
  setAdult: Dispatch<SetStateAction<number>>;
  childrens: number;
  setChildrens: Dispatch<SetStateAction<number>>;
  range: DateRange | undefined;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
};
const OtpContext = createContext<OtpContextType | null>(null);
const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      firstName
      lastName
      email
      role
      dateOfBirth
    }
  }
`;
export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime, setStartTime] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<BookingDataType>({
    userId: '',
    id: '',
    hotelId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    status: '',
    __typeName: '',
  });
  const [me, setMe] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [adult, setAdult] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const client = useApolloClient();
  useEffect(() => {
    if (!startTime || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [startTime, timeLeft]);
  const resetOtp = () => {
    setStartTime(true);
    setTimeLeft(90);
    setStartTime(false);
    setTimeout(() => setStartTime(true), 0);
  };
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
    setToken(storedToken);
    client
      .query({ query: GET_ME, fetchPolicy: 'no-cache' })
      .then((res) => {
        if (res.data?.getMe) setMe(res.data.getMe);
      })
      .catch(() => {
        setMe(null);
        setToken(null);
        localStorage.removeItem('token');
      });
  }, [client]);
  return (
    <OtpContext.Provider
      value={{
        step,
        setStep,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        otp,
        setOtp,
        timeLeft,
        startTime,
        setStartTime,
        resetOtp,
        setTimeLeft,
        bookingSuccess,
        setBookingSuccess,
        bookingData,
        setBookingData,
        me,
        setMe,
        token,
        setToken,
        adult,
        setAdult,
        childrens,
        setChildrens,
        range,
        setRange,
      }}
    >
      {children}
    </OtpContext.Provider>
  );
};
export const useOtpContext = () => {
  const ctx = useContext(OtpContext);
  if (!ctx) throw new Error('useOtpContext must be used inside UserAuthProvider');
  return ctx;
};
