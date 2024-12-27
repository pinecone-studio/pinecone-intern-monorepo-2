'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBirthdaySubmitMutation } from '@/generated';
import { useState } from 'react';

const Birthday = () => {
  const router = useRouter();
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [birthdaySubmit] = useBirthdaySubmitMutation({
    onCompleted: () => {
      router.push('/register/userdetails');
    },
    onError: () => {
      setError('An error occurred while submitting your birthday. Please try again.');
    },
  });
  const currentYear = new Date().getFullYear();
  const isValidInput = () => {
    return day && month && year;
  };
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');

    if (!isValidInput()) {
      setError('Please complete the date of birth');
      return;
    }

    const birthDate = new Date(`${year}-${month}-${day}`);
    const age = calculateAge(birthDate);

    if (age < 18) {
      setError("We'll meet when you turn 18.");
      return;
    }

    birthdaySubmit({
      variables: {
        input: { age },
      },
    });
  };

  const handleBack = () => {
    router.push('/register/attraction');
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 31 || value === '')) {
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 12 || value === '')) {
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value) && (parseInt(value) <= currentYear || value === '')) {
      setYear(value);
    }
  };
  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[200px]" data-cy="birthday-page">
      <div className="flex flex-col items-center w-full gap-6">
        <div className="flex items-center gap-1" data-cy="logo-container">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
          <p className="text-3xl font-semibold text-gray-600">tinder</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900" data-cy="question-title">
            How old are you?
          </p>
          <p className="text-[#71717A] text-sm" data-cy="question-description">
            Please enter your age to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2 justify-center" data-cy="input-field">
            <input
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={handleDayChange}
              placeholder="DD"
              className={`px-4 py-2 border rounded-lg w-20 ${!day ? 'border-red-500' : ''}`}
              maxLength={2}
              autoFocus
              data-cy="day-input"
            />
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={handleMonthChange}
              placeholder="MM"
              className={`px-4 py-2 border rounded-lg w-20 ${!month ? 'border-red-500' : ''}`}
              maxLength={2}
              data-cy="month-input"
            />
            <input
              type="number"
              min="1900"
              value={year}
              onChange={handleYearChange}
              placeholder="YYYY"
              className={`px-4 py-2 border rounded-lg w-32 ${!year ? 'border-red-500' : ''}`}
              maxLength={4}
              data-cy="year-input"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2" data-cy="type-error">
              {error}
            </p>
          )}
          <div className="flex justify-between w-[296px]" data-cy="navigation-buttons">
            <button type="button" onClick={handleBack} className="px-4 py-2 border rounded-full hover:bg-gray-100 border-1" data-cy="back-button">
              Back
            </button>
            <button type="submit" className="hover:bg-black bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="next-button">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Birthday;
