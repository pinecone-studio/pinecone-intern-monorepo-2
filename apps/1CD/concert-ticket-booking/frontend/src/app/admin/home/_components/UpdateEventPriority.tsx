'use client';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateEventPriorityMutation } from '@/generated';

export const UpdateEventPriority = ({ eventId,index }: { eventId: string, index: number }) => {
  const [selectedOption, setSelectedOption] = useState('low');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [updatePriority] = useUpdateEventPriorityMutation({
    onCompleted: () => {
      toast.success('success');
    },
    onError: () => {
      toast.error('failed to save');
    },
  });
  const handleUpdatePriority = async (id: string) => {
    if (selectedOption === 'high') {
      await updatePriority({
        variables: {
          id,
          input: { priority: 'high' },
        },
      });
    } else {
      await updatePriority({
        variables: {
          id,
          input: { priority: 'low' },
        },
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div data-testid="UpdateEventPriority-Component">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Star data-cy={`priority-toggle-button-${index}`} className="h-5 w-5 bg-[#F4F4F5] rounded cursor-pointer p-[2px]" />
        </AlertDialogTrigger>

        <AlertDialogContent className="w-[511px] border-none shadow-none" data-testid="UpdateEventPriority-DialogContent">
          <Card className="w-full border-none gap-4" data-testid="UpdateEventPriority-Card">
            <CardHeader className="gap-4" data-testid="UpdateEventPriority-CardHeader">
              <div className="flex justify-between items-center" data-testid="UpdateEventPriority-HeaderActions">
                <CardTitle data-testid="UpdateEventPriority-Title">Онцлох тоглолт болгох</CardTitle>
                <AlertDialogCancel asChild>
                  <button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Close" data-testid="exit" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </AlertDialogCancel>
              </div>

              <RadioGroup value={selectedOption} onValueChange={(value) => setSelectedOption(value)} className="flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="r1" data-testid="yes-button" />
                  <Label htmlFor="r1">Тийм</Label>
                </div>
                <div className="flex items-center space-x-2" data-testid="UpdateEventPriority-RadioOptionNo">
                  <RadioGroupItem value="low" id="r2" data-testid="no-button" />
                  <Label htmlFor="r2">Үгүй</Label>
                </div>
              </RadioGroup>
            </CardHeader>

            <CardFooter className="flex justify-between" data-testid="UpdateEventPriority-CardFooter">
              <button className="w-full border rounded bg-black text-white p-2" data-cy="submit-button" data-testid="btn" placeholder="btn" onClick={() => handleUpdatePriority(eventId)}>
                Хадгалах
              </button>
            </CardFooter>
          </Card>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
