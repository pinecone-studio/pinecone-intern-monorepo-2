import React from 'react';

interface PersonalInfoProps {
  day: string;
  month: string;
  year: string;
  handleDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMonthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  day, month, year, handleDayChange, handleMonthChange, handleYearChange,
}) => {
  return (
    <div className="space-y-6" data-cy="PersonalInfo">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-zinc-950" data-cy="NameLabel">Name</p>
          <input
            data-cy="NameInput"
            placeholder="Elon"
            className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
          />
        </div>
        <div>
          <p className="text-sm text-zinc-950" data-cy="EmailLabel">Email</p>
          <input
            data-cy="EmailInput"
            placeholder="Musk"
            className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col gap-2 text-sm" data-cy="DateOfBirthSection">
        <p className="text-sm text-zinc-950" data-cy="DateOfBirthLabel">Date of birth</p>

        <div className="flex gap-2">
          <input
            data-cy="DayInput"
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={handleDayChange}
            placeholder="DD"
            className="px-4 py-2 border rounded-lg w-20"
            maxLength={2}
          />
          <input
            data-cy="MonthInput"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={handleMonthChange}
            placeholder="MM"
            className="px-4 py-2 border rounded-lg w-20"
            maxLength={2}
          />
          <input
            data-cy="YearInput"
            type="number"
            min="1900"
            value={year}
            onChange={handleYearChange}
            placeholder="YYYY"
            className="px-4 py-2 border rounded-lg w-32"
            maxLength={4}
          />
        </div>
        <p className="text-xs text-zinc-500" data-cy="DateOfBirthInfo">
          Your date of birth is used to calculate your age.
        </p>
      </div>

      {/* Bio Section */}
      <div data-cy="BioSection">
        <p className="text-sm text-zinc-950" data-cy="BioLabel">Bio</p>
        <textarea
          data-cy="BioInput"
          placeholder="Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design."
          className="w-full h-20 rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3 mt-2 resize-none"
          style={{ minHeight: '3rem', maxHeight: '4.5rem' }}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
