'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SelectInterest, DateOfBirth, YourDetails, UploadYourImage, FormCompleted } from '../_components/_user-form-components';

const steps = [SelectInterest, DateOfBirth, YourDetails, UploadYourImage, FormCompleted];
const lastIndex = steps.length - 1;

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.98,
    rotate: dir > 0 ? 0.3 : -0.3,
    filter: 'blur(2px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 380, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.98,
    rotate: dir > 0 ? -0.3 : 0.3,
    filter: 'blur(2px)',
    transition: { duration: 0.22 },
  }),
};

const FormPage = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const nextPage = () => {
    setDirection(1);
    setCurrentCard((i) => Math.min(i + 1, lastIndex));
  };

  const previousPage = () => {
    setDirection(-1);
    setCurrentCard((i) => Math.max(i - 1, 0));
  };

  const FormPageComponent = steps[currentCard];

  return (
    <div className="flex flex-col items-center pt-32 w-2/3 h-screen s mx-auto" style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div key={currentCard} layout custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="will-change-transform">
          <FormPageComponent nextPage={nextPage} previousPage={previousPage} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FormPage;
