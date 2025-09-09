'use client';
import { useStep } from '../../components/providers/StepProvider';
import { Step1 } from '../../components/signup/Step1';
import { Step2 } from '../../components/signup/Step2';
import { ConfirmCode } from '../../components/signup/ConfirmCode';


const Signup = () => {
  const { step } = useStep();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relaitve ">
      {step == 1 && <Step1 />}
      {step == 2 && <ConfirmCode />}
      {step == 3 && <Step2 />}
      <div className="absolute bottom-10 text-[14px] font-light text-[#71717a]">©2024 Tinder</div>
    </div>
  );
};

export default Signup;
