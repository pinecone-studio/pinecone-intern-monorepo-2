'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';

type TextInputProps = {
  name: string;
  labelText?: string;
  type?: string;
  placeholder?: string;
};

const TextInput = ({ name, labelText, type = 'text', placeholder }: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const renderLabel = () =>
    labelText && (
      <Label htmlFor={name} className="text-white text-sm font-medium">
        {labelText}
      </Label>
    );

  const renderInput = () => {
    const commonClassName = `w-full rounded-md bg-zinc-900 text-white text-sm shadow-sm focus:outline-none focus:ring-2 ${
      error ? 'border-red-500' : 'border-zinc-700'
    }`;

    if (type === 'textarea') {
      return (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          className={`${commonClassName} border px-3 py-2 focus:ring-pink-600 h-[80px] resize-none`}
        />
      );
    }

    return (
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`${commonClassName} placeholder:text-zinc-500 border focus:ring-blue-500`}
      />
    );
  };

  const renderError = () =>
    error && <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="flex flex-col gap-2">
      {renderLabel()}
      {renderInput()}
      {renderError()}
    </div>
  );
};

export default TextInput;
