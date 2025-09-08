import { useStep } from '../providers/StepProvider';
import { Logo } from './SharedComponents';
import { useStep2Form } from './Step2Form';
import { Step2FormFields } from './Step2FormFields';

export const Step2 = () => {
  const { values, setStep } = useStep();
  const { register, handleSubmit, formState, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, loading, onSubmit } = useStep2Form({ email: values.email, setStep });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-[350px] h-[414px]  flex flex-col gap-6 items-center" data-testid="step2-container">
        <div className="flex flex-col items-center">
          <div>
            <Logo />
          </div>
          <div className="text-[24px] font-semibold" data-testid="title">
            Create password
          </div>
          <div className="text-[14px] text-center text-[#71717a]" data-testid="subtitle">
            Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers
          </div>
        </div>
        <Step2FormFields
          register={register}
          formState={formState}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          loading={loading}
        />
      </div>
    </form>
  );
};
