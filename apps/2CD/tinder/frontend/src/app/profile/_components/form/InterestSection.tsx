'use client';

import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';

//mock data
const interestOptions = [
  'Art',
  'Music',
  'Investment',
  'Technology',
  'Design',
  'Education',
  'Health',
  'Fashion',
  'Travel',
  'Food',
  'Hiking',
  'Gaming',
  'Sports',
  'Photography',
  'Writing',
  'Cooking',
  'Fitness',
  'Movies',
  'Reading',
  'Nature',
];

type FormValues = {
  selectedInterests: string[];
};

const InterestSection = () => {
  const { setValue, watch } = useFormContext<FormValues>();
  const selected = watch('selectedInterests') || [];

  const handleToggle = (value: string) => {
    const isSelected = selected.includes(value);

    if (!isSelected && selected.length >= 10) return;

    const newSelected = isSelected ? selected.filter((item) => item !== value) : [...selected, value];

    setValue('selectedInterests', newSelected, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-white text-sm font-medium">Interests</p>
      <div className="flex flex-wrap gap-2">
        {interestOptions.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => handleToggle(option)}
              className={`cursor-pointer rounded-full px-3 py-1 transition-colors duration-200 text-white ${
                isSelected ? 'bg-rose-600 hover:bg-rose-700' : 'bg-zinc-900 hover:bg-zinc-700 border-zinc-700'
              }`}
            >
              {option}
            </Badge>
          );
        })}
      </div>
      <p className="text-sm text-zinc-400">You can select up to a maximum of 10 interests.</p>
    </div>
  );
};

export default InterestSection;
