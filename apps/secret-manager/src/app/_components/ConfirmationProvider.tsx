'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type ConfrimOptions = {
  fn: () => Promise<void> | void;
  message: string;
};

type ConfirmationContextType = {
  confirm: (_options: ConfrimOptions) => void;
};

const ConfirmationContext = createContext<ConfirmationContextType>({} as ConfirmationContextType);

export const ConfirmationProvider = ({ children }: PropsWithChildren) => {
  const [confirm, setConfirm] = useState<ConfrimOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmAction = (options: ConfrimOptions) => {
    setConfirm(options);
  };

  const handleClose = () => {
    setConfirm(null);
  };

  const handleOpenStateChange = (open: boolean) => {
    if (!open) {
      setConfirm(null);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await confirm?.fn();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm: confirmAction }}>
      {children}

      <Dialog open={!!confirm} onOpenChange={handleOpenStateChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>{confirm?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button size="sm" variant="destructive" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button size="sm" variant="default" disabled={loading} onClick={handleConfirm}>
              <div className="flex justify-center w-[64px]">{loading ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}</div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => useContext(ConfirmationContext);
