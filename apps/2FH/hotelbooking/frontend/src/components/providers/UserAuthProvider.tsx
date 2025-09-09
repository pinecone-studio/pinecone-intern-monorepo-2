/* eslint-disable */
'use client';

import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { gql, useApolloClient } from '@apollo/client';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

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

type Role = 'user' | 'admin';
type UserType = { _id: string; firstName: string; lastName: string; email: string; role: Role; dateOfBirth: string };
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
  setBookingData: Dispatch<
    SetStateAction<{
      userId: string;
      hotelId: string;
      roomId: string;
      checkInDate: string;
      checkOutDate: string;
      childrens: number;
      adults: number;
      status: string;
      roomCustomer: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
      };
    }>
  >;
  bookingData: {
    userId: string;
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    childrens: number;
    adults: number;
    status: string;
    roomCustomer: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
  me: UserType | null;
  setMe: Dispatch<SetStateAction<UserType | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  adult: number;
  setAdult: Dispatch<SetStateAction<number>>;
  childrens: number;
  setChildrens: Dispatch<SetStateAction<number>>;
  range: DateRange | undefined;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
  loading: boolean;
  signOut: () => void;
  nights: number;
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
  const [me, setMe] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [adult, setAdult] = useState(0);
  const [childrens, setChildrens] = useState(0);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [bookingData, setBookingData] = useState({
    userId: '',
    hotelId: '',
    roomId: '',
    checkInDate: range?.from ? range.from.toLocaleDateString('en-CA') : '',
    checkOutDate: range?.to ? range.to.toLocaleDateString('en-CA') : '',
    adults: adult,
    childrens: childrens,
    status: '',
    roomCustomer: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const [loading, setLoading] = useState(true);

  const client = useApolloClient();
  const rounter = useRouter();
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

  const parseUser = (u: any): UserType => ({
    _id: u._id,
    email: u.email,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    role: (u.role as Role) || 'user',
    dateOfBirth: u.dateOfBirth || '',
  });

  const fetchMe = async (storedToken: string) => {
    setLoading(true);
    try {
      const res = await client.query({ query: GET_ME, fetchPolicy: 'no-cache', context: { headers: { authorization: `Bearer ${storedToken}` } } });
      if (res.data?.getMe) setMe(parseUser(res.data.getMe));
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setMe(null);
    setToken(null);
    rounter.push('/login');
    setStep(1);
    setBookingData({
      userId: '',
      hotelId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      adults: 0,
      childrens: 0,
      status: '',
      roomCustomer: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      },
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    fetchMe(storedToken);
  }, [client]);
  console.log('Check in', bookingData.checkInDate);
  console.log('CHeck out', bookingData.checkOutDate);
  console.log('Children', bookingData.childrens);
  console.log('ADults', bookingData.adults);

  console.log('BOOKING DATA', bookingData);

  const nights = useMemo(() => {
    if (range?.from && range?.to) {
      return differenceInCalendarDays(range.to, range.from);
    }
    return 0;
  }, [range]);

  console.log(nights);

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
        loading,
        signOut,
        nights,
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
