'use client';
import { useState, useEffect } from 'react';
import InterestedIn from './step/InterestedIn';
import DateAndBirth from './step/DateAndBirth';
import DetailBasic from './step/DetailBasic';


const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    console.log('nextStep дуудагдлаа, одоогийн currentStep:', currentStep);
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 2);
      console.log('Шинэ алхам:', newStep);
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      console.log('Өмнөх алхам дуудагдлаа, шинэ алхам:', newStep);
      return newStep;
    });
  };

  const renderStep = () => {
    console.log('Харагдуулж буй алхам:', currentStep);
    switch (currentStep) {
      case 0:
        return <InterestedIn nextStep={nextStep} />;
      case 1:
        return <DateAndBirth nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        return <DetailBasic nextStep={nextStep} prevStep={prevStep} />;
      default:
        return <InterestedIn nextStep={nextStep} />;
    }
  };

  return (
    <div>
      <p>Одоогийн алхам: {currentStep}</p>
      {renderStep()}
    </div>
  );
};

export default Page;