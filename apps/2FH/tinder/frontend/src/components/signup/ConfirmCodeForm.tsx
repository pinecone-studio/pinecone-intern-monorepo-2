import { useTimer, useOtpCode, useOtpResend, useOtpVerification } from './hooks';
import { ConfirmCodeContent } from './ConfirmCodeContent';

interface ConfirmCodeFormProps {
  email: string;
  setStep: (_step: number) => void;
}

export const ConfirmCodeForm = ({ email, setStep: _setStep }: ConfirmCodeFormProps) => {
  const { timer, resetTimer } = useTimer(15);
  const { code, inputsRef, handleChange, handleKeyDown } = useOtpCode();
  const { resending, handleResend } = useOtpResend(email, resetTimer);
  const { loading, handleVerify } = useOtpVerification(email, code, _setStep);

  return (
    <ConfirmCodeContent
      email={email}
      code={code}
      inputsRef={inputsRef}
      handleChange={handleChange}
      handleKeyDown={handleKeyDown}
      loading={loading}
      handleVerify={handleVerify}
      timer={timer}
      resending={resending}
      handleResend={handleResend}
    />
  );
};
