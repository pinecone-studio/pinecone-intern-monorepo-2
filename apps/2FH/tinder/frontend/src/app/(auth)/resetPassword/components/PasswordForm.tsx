import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

type FormValues = {
  password: string;
  confirmPassword: string;
};

interface PasswordFormProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  showPassword: boolean;
  setShowPassword: (_show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (_show: boolean) => void;
  onSubmit: (_data: FormValues) => void;
  loading: boolean;
  handleSubmit: UseFormHandleSubmit<FormValues>;
}

const PasswordField = ({
  label,
  name,
  register,
  error,
  showPassword,
  setShowPassword,
  dataCy,
}: {
  label: string;
  name: 'password' | 'confirmPassword';
  register: UseFormRegister<FormValues>;
  error: FieldErrors<FormValues>[keyof FormValues];
  showPassword: boolean;
  setShowPassword: (_show: boolean) => void;
  dataCy: string;
}) => (
  <div className="mb-4 relative">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        {...register(name, { required: `${label} is required` })}
        placeholder={label}
        className="w-full pr-10 px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center px-3"
        data-cy={dataCy}
      >
        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

export const PasswordForm = ({
  register,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  loading,
  handleSubmit,
}: PasswordFormProps) => (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <PasswordField
      label="New Password"
      name="password"
      register={register}
      error={errors.password}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      dataCy="toggle-new-password"
    />

    <PasswordField
      label="Confirm Password"
      name="confirmPassword"
      register={register}
      error={errors.confirmPassword}
      showPassword={showConfirmPassword}
      setShowPassword={setShowConfirmPassword}
      dataCy="toggle-confirm-password"
    />

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-tinder-pink hover:bg-pink-600 text-white text-sm font-semibold py-3 rounded-2xl mt-4 transition duration-200 ease-in-out"
    >
      {loading ? 'Resetting...' : 'Continue'}
    </button>
  </form>
); 