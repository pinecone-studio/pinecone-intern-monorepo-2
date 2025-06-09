'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Star } from 'lucide-react';
import { useState } from 'react';
export const FeatureConcert = ({ onClick, loading }: { loading: boolean; onClick: () => void }) => {
  const [open, setOpen] = useState(false);
  const featureConcert = async () => {
    await onClick();
    setOpen(false);
  };
  return (
    <Dialog data-testid="feature-concert-dialog" open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button data-testid="feature-open-concert-dialog" onClick={() => setOpen(true)} variant="secondary">
          <Star size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="feature-concert-dialog-content">
        <DialogHeader data-testid="feature-concert-header">
          <DialogTitle data-testid="feature-concert-title">Онцлох тоглолт болгох</DialogTitle>
        </DialogHeader>
        <DialogFooter data-testid="feature-concert-footer">
          <Button data-testid="feature-concert-cancel" onClick={() => setOpen(false)}>
            болих
          </Button>
          <Button data-testid="feature-concert-submit" disabled={loading} onClick={featureConcert}>
            {loading ? <Loader2 className="animate-spin" /> : 'Хадгалах'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
