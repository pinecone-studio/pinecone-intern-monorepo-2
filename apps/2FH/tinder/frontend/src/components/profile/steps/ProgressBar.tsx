// 'use client';

// import React from 'react';

// interface ProgressBarProps {
//   currentStep: number;
//   totalSteps: number;
// }

// export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
//   const progress = ((currentStep + 1) / totalSteps) * 100;

//   return (
//     <div className="my-5">
//       <div className="flex justify-between text-xs text-gray-500 mb-2">
//         <span>Step {currentStep + 1} of {totalSteps}</span>
//         <span>{Math.round(progress)}%</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-in-out"
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//     </div>
//   );
// }; 