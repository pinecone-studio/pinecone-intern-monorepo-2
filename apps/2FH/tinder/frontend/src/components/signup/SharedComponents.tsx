import Image from 'next/image';

interface LogoProps {
  testId?: string;
}

export const Logo = ({ testId = 'logo' }: LogoProps) => <Image src="/images/logo.png" alt="logo" width={100} height={100} className="w-[100px]" data-testid={testId} />;

interface EyeIconProps {
  isVisible: boolean;
  onClick: () => void;
  testId?: string;
}

export const EyeIcon = ({ isVisible, onClick, testId }: EyeIconProps) => (
  <div className="cursor-pointer h-4 w-4" onClick={onClick} data-testid={testId}>
    <Image src={isVisible ? '/images/visible.png' : '/images/eyehide.png'} alt="eye" width={16} height={16} className="w-[16px] h-[16px]" />
  </div>
);

interface OtpInputProps {
  code: string[];
  inputsRef: React.RefObject<(HTMLInputElement | null)[]>;
  handleChange: (_value: string, _index: number) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>, _index: number) => void;
  testId?: string;
}

export const OtpInputs = ({ code, inputsRef, handleChange, handleKeyDown, testId = 'otp-inputs-container' }: OtpInputProps) => (
  <div className="flex gap-2" data-testid={testId}>
    {code.map((digit, i) => (
      <input
        key={i}
        ref={(el) => {
          if (el) {
            inputsRef.current[i] = el;
          }
        }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digit}
        onChange={(_e) => handleChange(_e.target.value, i)}
        onKeyDown={(_e) => handleKeyDown(_e, i)}
        className="w-12 h-12 text-center text-lg border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid={`otp-input-${i}`}
      />
    ))}
  </div>
);
