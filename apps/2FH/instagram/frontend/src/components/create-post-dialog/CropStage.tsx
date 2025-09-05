import { ImagePlus, Plus } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

type CropStageProps = {
  files: File[];
  setFiles: (_files: File[]) => void;
  stage: string;
  Stages: string[];
};

export const CropStage = ({ files, setFiles, stage, Stages }: CropStageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThumbTray, setShowThumbTray] = useState(false);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setCurrentIndex(0), [files]);

  const handlePrevImage = () => setCurrentIndex((p) => (p - 1 + files.length) % files.length);
  const handleNextImage = () => setCurrentIndex((p) => (p + 1) % files.length);

  return (
    <div className="w-full flex justify-center relative">
      <div className="w-full max-w-2xl h-full  relative">
        <input
          ref={addMoreInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []).filter((f): f is File => f.type.startsWith('image/'));
            if (newFiles.length) setFiles([...files, ...newFiles]);
          }}
        />

        {files.length > 0 && (
          <div className="w-full max-w-4xl max-h-[80vh] flex justify-center items-center overflow-hidden">
            {files.length > 0 && <img src={URL.createObjectURL(files[currentIndex])} alt={`Preview ${currentIndex + 1}`} className="w-110 aspect-[4/5] object-contain" />}

            {files.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full">
                  ‹
                </button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full">
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {files.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-blue-500' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
            {stage === Stages[1] && (
              <button onClick={() => setShowThumbTray((v) => !v)} className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs flex items-center gap-1">
                <ImagePlus className="w-4 h-4" />
              </button>
            )}

            {showThumbTray && stage === Stages[1] && (
              <div className="absolute bottom-12 right-2 bg-black/70 text-white rounded-md p-2 flex items-center gap-2 overflow-x-auto max-w-full">
                {files.map((file, i) => (
                  <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-white/20">
                    <img src={URL.createObjectURL(file)} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFiles(files.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      type="button"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-white/30 hover:bg-white/10"
                  aria-label="Add more images"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
