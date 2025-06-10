'use client';

import { useController, Control } from 'react-hook-form';
import { FormValues } from './validation-schema';

type SelectInputProps = {
  labelText: string;
  placeholder?: string;
  options: string[];
  control: Control<FormValues>;
  name: keyof FormValues;
};

const SelectInput = ({ name, control, labelText, options }: SelectInputProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="flex flex-col">
      <label htmlFor={name as string} className="mb-1 text-white font-medium">
        {labelText}
      </label>
      <select
        id={name as string}
        {...field}
        value={field.value == null ? '' : String(field.value)}
        className={`rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600 ${
            error ? 'border-red-500' : ''
        }`}
        >
        {options.map(value => (
            <option key={value} value={value}>
            {value}
            </option>
        ))}
        </select>

      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
