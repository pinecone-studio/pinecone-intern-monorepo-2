import { Controller, Control } from 'react-hook-form';

type FormValues = {
  otp: string[];
};

interface OtpInputsProps {
  control: Control<FormValues>;
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  handleChange: (_index: number, _value: string, _onChange: (..._args: unknown[]) => void) => void;
  handleBackspace: (_index: number, _e: React.KeyboardEvent) => void;
}

export const OtpInputs = ({ control, inputRefs, handleChange, handleBackspace }: OtpInputsProps) => (
  <div className="flex justify-center space-x-2 mb-6">
    {[0, 1, 2, 3].map((index) => (
      <Controller
        key={index}
        name={`otp.${index}`}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            data-cy={`otp-input-${index}`}
            onChange={(e) => handleChange(index, e.target.value, field.onChange)}
            onKeyDown={(e) => handleBackspace(index, e)}
            onFocus={(e) => e.target.select()}
          />
        )}
      />
    ))}
  </div>
);
