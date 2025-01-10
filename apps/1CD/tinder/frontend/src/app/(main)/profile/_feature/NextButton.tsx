import React from 'react';

interface NextButtonProps {
  onClick: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick }) => (
  <div className="flex w-full sm:w-[640px] mt-4 gap-2 mx-auto sm:ml-0 sm:mr-0">
    <button
      type="button"
      data-cy="NextButton" // Adding data-cy for targeting in Cypress tests
      className="w-full sm:w-32 h-9 bg-rose-600 hover:bg-zinc-800 py-2 px-3 rounded-md text-white text-center cursor-pointer font-medium text-sm"
      onClick={onClick}
    >
      Next
    </button>
  </div>
);

export default NextButton;
