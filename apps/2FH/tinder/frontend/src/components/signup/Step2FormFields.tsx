import { EyeIcon } from './SharedComponents';
import type { UseFormRegister, FormState } from 'react-hook-form';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface PasswordFieldProps {
  register: UseFormRegister<FormData>;
  formState: FormState<FormData>;
  showPassword: boolean;
  setShowPassword: (_show: boolean) => void;
  fieldName: 'password' | 'confirmPassword';
  label: string;
  placeholder: string;
  testId: string;
}

const PasswordField = ({ register, formState, showPassword, setShowPassword, fieldName, label, placeholder, testId: _testId }: PasswordFieldProps) => (
  <div className="flex flex-col gap-1 w-full">
    <div className="text-[14px] flex items-center justify-between">
      <div data-testid={`${fieldName}-label`}>{label}</div>
      <EyeIcon isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} testId={`${fieldName}-toggle`} />
    </div>
    <input
      type={showPassword ? 'text' : 'password'}
      {...register(fieldName)}
      placeholder={placeholder}
      className="border-[1px] border-[#E4E4E7] h-9 w-full rounded-[6px] pl-4"
      data-testid={`${fieldName}-input`}
    />
    {formState.errors[fieldName] && (
      <p className="text-red-500 text-[12px]" data-testid={`${fieldName}-error`}>
        {formState.errors[fieldName]?.message}
      </p>
    )}
  </div>
);

interface Step2FormFieldsProps {
  register: UseFormRegister<FormData>;
  formState: FormState<FormData>;
  showPassword: boolean;
  setShowPassword: (_show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (_show: boolean) => void;
  loading: boolean;
}

export const Step2FormFields = ({ register, formState, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, loading }: Step2FormFieldsProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <PasswordField
        register={register}
        formState={formState}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        fieldName="password"
        label="Password"
        placeholder="Enter your password"
        testId="password"
      />
      <PasswordField
        register={register}
        formState={formState}
        showPassword={showConfirmPassword}
        setShowPassword={setShowConfirmPassword}
        fieldName="confirmPassword"
        label="Confirm password"
        placeholder="Confirm your password"
        testId="confirm-password"
      />
      {formState.errors.root && (
        <p className="text-red-500 text-[12px]" data-testid="root-error">
          {formState.errors.root?.message as string}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !formState.isDirty}
        className={`w-full h-9 rounded-full text-white flex items-center justify-center hover:opacity-100 duration-200
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E11D48] opacity-90'}
        `}
        data-testid="submit-button"
      >
        {loading ? 'Creating Account...' : 'Continue'}
      </button>
    </div>
  );
};
