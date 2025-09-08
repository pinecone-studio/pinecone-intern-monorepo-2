import { Logo, OtpInputs } from './SharedComponents';

interface HeaderProps {
  email: string;
}

const Header = ({ email }: HeaderProps) => (
  <div className="flex-col flex items-center justify-center gap-1">
    <div>
      <Logo />
    </div>
    <div className="text-[24px] font-semibold" data-testid="title">
      Confirm your email
    </div>
    <div className="text-[14px] text-[#71717a] text-center" data-testid="subtitle">
      To continue, enter the secure code we sent to <b>{email}</b>. Check junk mail if it&apos;s not in your inbox.
    </div>
  </div>
);

interface VerifyButtonProps {
  loading: boolean;
  code: string[];
  handleVerify: () => void;
}

const VerifyButton = ({ loading, code, handleVerify }: VerifyButtonProps) => (
  <button
    onClick={handleVerify}
    disabled={loading || code.join('').length !== 4}
    className={`w-[100px] h-9 rounded-full text-white flex items-center justify-center hover:opacity-100 duration-200
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E11D48] opacity-90'}
      `}
    data-testid="verify-button"
  >
    {loading ? 'Verifying...' : 'Verify'}
  </button>
);

interface ResendButtonProps {
  timer: number;
  resending: boolean;
  handleResend: () => void;
}

const ResendButton = ({ timer, resending, handleResend }: ResendButtonProps) => (
  <button onClick={handleResend} disabled={timer > 0 || resending} className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-[#E11D48] hover:underline'}`} data-testid="resend-button">
    {resending ? 'Sending...' : timer > 0 ? `Send again (${timer})` : 'Send again'}
  </button>
);

interface ConfirmCodeContentProps {
  email: string;
  code: string[];
  inputsRef: React.RefObject<(HTMLInputElement | null)[]>;
  handleChange: (_value: string, _index: number) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>, _index: number) => void;
  loading: boolean;
  handleVerify: () => void;
  timer: number;
  resending: boolean;
  handleResend: () => void;
}

export const ConfirmCodeContent = ({ email, code, inputsRef, handleChange, handleKeyDown, loading, handleVerify, timer, resending, handleResend }: ConfirmCodeContentProps) => {
  return (
    <div className="w-[350px] h-[414px] flex flex-col items-center gap-[24px]" data-testid="confirm-code-container">
      <Header email={email} />

      <div className="w-full flex flex-col gap-4 items-center">
        <OtpInputs code={code} inputsRef={inputsRef} handleChange={handleChange} handleKeyDown={handleKeyDown} />
      </div>

      <VerifyButton loading={loading} code={code} handleVerify={handleVerify} />
      <ResendButton timer={timer} resending={resending} handleResend={handleResend} />
    </div>
  );
};
