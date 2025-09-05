'use client';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
interface DialogHeaderProps {
  stage: string;
  Stages: string[];
  setStage: (_stage: string) => void;
  selectedFiles: File[];
  handleCreatePost: () => Promise<void>;
  setIsPostDialogOpen: (_isOpen: boolean) => void;
  isUploading: boolean;
}
export const DialogContentHeader = ({ stage: _stage, Stages, setStage, selectedFiles, handleCreatePost, setIsPostDialogOpen, isUploading }: DialogHeaderProps) => {
  const [showDiscard, setShowDiscard] = useState(false);
  const handleBackbutton = () => {
    if (_stage === Stages[1]) {
      setShowDiscard(true);
      return;
    }
    const idx = Stages.indexOf(_stage);
    if (idx > 1) setStage(Stages[idx - 1]);
  };

  const handleNextButton = async () => {
    if (_stage === Stages[0]) {
      if (selectedFiles.length > 0) setStage(Stages[1]);
      return;
    }
    if (_stage === Stages[1]) {
      setStage(Stages[2]);
      return;
    }
    if (_stage === Stages[2]) {
      setStage(Stages[3]);
      await handleCreatePost();
      return;
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscard(false);
    setIsPostDialogOpen(false);
  };

  const handleDiscardCancel = () => {
    setShowDiscard(false);
  };
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 p-4">
      {(_stage == Stages[1] || _stage == Stages[2]) && <ArrowLeftIcon onClick={handleBackbutton} className="w-5 h-5" />}
      <h2 className="text-xl font-semibold text-gray-900">{_stage}</h2>
      {(_stage == Stages[1] || _stage == Stages[2]) && (
        <button
          onClick={handleNextButton}
          disabled={isUploading || (_stage === Stages[0] && selectedFiles.length === 0)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 rounded-md hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {_stage === Stages[2] ? (isUploading ? '' : 'Share') : 'Next'}
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
              <button onClick={handleDiscardConfirm} className="w-full py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                Discard
              </button>
              <button onClick={handleDiscardCancel} className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
