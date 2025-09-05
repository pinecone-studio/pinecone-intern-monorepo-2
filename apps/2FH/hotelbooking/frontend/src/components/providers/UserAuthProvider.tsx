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
  bookingData: BookingDataType;
  setBookingData: Dispatch<SetStateAction<BookingDataType>>;
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
  const [bookingData, setBookingData] = useState<BookingDataType>({ userId: '', id: '', hotelId: '', roomId: '', checkInDate: '', checkOutDate: '', status: '', __typeName: '' });
  const [me, setMe] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [adult, setAdult] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [loading, setLoading] = useState(true);

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

  // Separate function to parse user data
  const parseUser = (u: any): UserType => ({
    _id: u._id,
    email: u.email,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    role: (u.role as Role) || 'user',
    dateOfBirth: u.dateOfBirth || '',
  });

  // Separate function to fetch user
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

  // inside UserAuthProvider
  const signOut = () => {
    localStorage.removeItem('token');
    setMe(null);
    setToken(null);
    setStep(1);
    setBookingData({ userId: '', id: '', hotelId: '', roomId: '', checkInDate: '', checkOutDate: '', status: '', __typeName: '' });
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
