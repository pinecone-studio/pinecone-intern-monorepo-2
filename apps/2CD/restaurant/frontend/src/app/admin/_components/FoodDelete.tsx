'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const DELETE_FOOD = gql`
  mutation DeleteFood($_id: ID!) {
    deleteFood(_id: $_id) {
      _id
      name
    }
  }
`;

interface FoodDeleteProps {
  foodId: string;
  onDeleted?: () => void;
}

export const FoodDelete = ({ foodId, onDeleted }: FoodDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [deleteFood, { loading, error }] = useMutation(DELETE_FOOD, {
    onCompleted: () => {
      setOpen(false);
      onDeleted?.();
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Trash />
        </DialogTrigger>
        <DialogContent className="w-[339px] h-auto gap-4">
          <DialogHeader className="h-10">
            <DialogTitle>Хоолноос хасах</DialogTitle>
            <DialogDescription>Хасахдаа итгэлтэй байна уу?</DialogDescription>
          </DialogHeader>
          {error && <div className="text-red-500 text-sm mb-2">Алдаа гарлаа. Дахин оролдоно уу.</div>}
          <div>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => deleteFood({ variables: { _id: foodId } })}
              disabled={loading}
            >
              {loading ? 'Устгаж байна...' : 'Хасах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};