import { useStep } from '../providers/StepProvider';
import { ConfirmCodeForm } from './ConfirmCodeForm';

export const ConfirmCode = () => {
  const { setStep, values } = useStep();

  return <ConfirmCodeForm email={values.email} setStep={setStep} />;
};
