import { useStep } from '../providers/stepProvider';
import { ConfirmCodeForm } from './ConfirmCodeForm';

export const ConfirmCode = () => {
  const { setStep, values } = useStep();

  return <ConfirmCodeForm email={values.email} setStep={setStep} />;
};
