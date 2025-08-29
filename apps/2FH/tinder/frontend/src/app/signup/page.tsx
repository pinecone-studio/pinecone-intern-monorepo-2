'use client';

import { useStep } from '../../components/providers/stepProvider';
import { Step1 } from '../../components/signup/step1';
import { Step2 } from '../../components/signup/step2';
import { ConfirmCode } from '../../components/signup/confirmCode';

export default function Signup() {
  const { step } = useStep();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relaitve ">
      {step == 1 && <Step1 />}
      {step == 2 && <ConfirmCode />}
      {step == 3 && <Step2 />}
      <div className="absolute bottom-10 text-[14px] font-light text-[#71717a]">©2024 Tinder</div>
    </div>
  );
}
