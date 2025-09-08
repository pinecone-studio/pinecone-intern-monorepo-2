'use client';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';

interface DialogHeaderProps {
  stage: string;
  Stages: string[];
  setStage: (_stage: string) => void;
  handleCreatePost: () => Promise<void>;
  setIsPostDialogOpen: (_isOpen: boolean) => void;
  isUploading: boolean;
}

export const handleBackbutton = (stage: string, Stages: string[], setStage: (_stage: string) => void, setShowDiscard: (_show: boolean) => void) => {
  if (stage === Stages[1]) {
    setShowDiscard(true);
  } else if (stage === Stages[2]) {
    setStage(Stages[1]);
  }
};

const handleNextButton = async (stage: string, Stages: string[], setStage: (_stage: string) => void, handleCreatePost: () => Promise<void>) => {
  if (stage === Stages[1]) {
    setStage(Stages[2]);
  } else if (stage === Stages[2]) {
    await handleCreatePost();
    setStage(Stages[3]);
  }
};

const getButtonConfig = (stage: string, Stages: string[], isUploading: boolean) => {
  const shouldShowBackArrow = stage !== Stages[0] && stage !== Stages[3];
  const shouldShowNextButton = stage !== Stages[3];
  const isShareButton = stage === Stages[2];
  const isButtonDisabled = isShareButton && isUploading;
  const buttonText = isShareButton ? (isUploading ? '' : 'Share') : 'Next';

  return { shouldShowBackArrow, shouldShowNextButton, isShareButton, isButtonDisabled, buttonText };
};

export const DialogContentHeader = ({ stage: _stage, Stages, setStage, handleCreatePost, setIsPostDialogOpen, isUploading }: DialogHeaderProps) => {
  const [showDiscard, setShowDiscard] = useState(false);

  const handleBackbuttonClick = () => {
    handleBackbutton(_stage, Stages, setStage, setShowDiscard);
  };

  const handleNextButtonClick = async () => {
    await handleNextButton(_stage, Stages, setStage, handleCreatePost);
  };

  const handleDiscardConfirm = () => {
    setShowDiscard(false);
    setIsPostDialogOpen(false);
  };

  const handleDiscardCancel = () => {
    setShowDiscard(false);
  };

  const { shouldShowBackArrow, shouldShowNextButton, isButtonDisabled, buttonText } = getButtonConfig(_stage, Stages, isUploading);

  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 p-4">
      {shouldShowBackArrow && <ArrowLeftIcon data-testid="back-arrow" onClick={handleBackbuttonClick} className="w-5 h-5" />}
      <h2 className="text-xl font-semibold text-gray-900">{_stage}</h2>
      {shouldShowNextButton && (
        <button
          data-testid="next-button"
          onClick={handleNextButtonClick}
          disabled={isButtonDisabled}
          className="px-4 py-2 text-sm font-medium text-indigo-600 rounded-md hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {buttonText}
        </button>
      )}

      {showDiscard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Discard post?</h2>
              <p className="text-sm text-gray-600">If you leave, your edits won&apos;t be saved.</p>
            </div>
            <div className="space-y-2">
              <button data-testid="discard-confirm" onClick={handleDiscardConfirm} className="w-full py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                Discard
              </button>
              <button data-testid="discard-cancel" onClick={handleDiscardCancel} className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
