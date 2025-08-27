'use client';

import { useOtpContext } from '@/components/providers';
import { EmailValidate } from '@/components/signup/_components/EmailValidate';
import { EnterEmail } from '@/components/signup/_components/EnterEmail';
import { EnterPassword } from '@/components/signup/_components/EnterPassword';


const SignUpHomePage = () => {
  const { step } = useOtpContext();
  return (
    <div data-cy="Sign-Up-Container" className="w-screen h-screen flex justify-center items-center">
      <div data-cy="Child-Container" className="w-fit h-fit flex justify-center items-center flex-col">
        <div data-cy="Logo-Container">
          <img src="./images/PediaLogo.png" alt="Logo" />
        </div>
        {step === 1 && <EnterEmail />}
        {step === 2 && <EmailValidate />}
        {step === 3 && <EnterPassword />}
      </div>
    </div>
  );
};
export default SignUpHomePage;
