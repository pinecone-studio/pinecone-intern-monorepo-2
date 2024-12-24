import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-1px)] bg-black">
      <div className="w-10 h-10 border-4 border-t-4 border-white border-solid rounded-full animate-spin">
        <h1 className="text">Loading</h1>
      </div>
    </div>
  );
};

export default LoadingSpinner;
