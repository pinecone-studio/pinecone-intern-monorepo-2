import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Info } from 'lucide-react';
import type { OptionalExtra } from './types';

export const OptionalExtrasSection = ({
  optionalExtras,
  onOptionalExtrasChange,
  ...props
}: {
  optionalExtras: OptionalExtra[];
  onOptionalExtrasChange: (_optionalExtras: OptionalExtra[]) => void;
}) => {
  const addOptionalExtra = () => {
    onOptionalExtrasChange([
      ...optionalExtras,
      {
        youNeedToKnow: '',
        weShouldMention: '',
      },
    ]);
  };

  const removeOptionalExtra = (index: number) => {
    onOptionalExtrasChange(optionalExtras.filter((_, i) => i !== index));
  };

  const updateOptionalExtra = (index: number, field: keyof OptionalExtra, value: string) => {
    const newOptionalExtras = [...optionalExtras];
    newOptionalExtras[index] = { ...newOptionalExtras[index], [field]: value };
    onOptionalExtrasChange(newOptionalExtras);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={20} className="text-green-500" />
          What You Need to Know
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {optionalExtras.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Extra Information {index + 1}</h4>
              {optionalExtras.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeOptionalExtra(index)}>
                  <X size={16} />
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`you-need-to-know-${index}`}>What You Need to Know</Label>
              <Textarea
                id={`you-need-to-know-${index}`}
                value={item.youNeedToKnow}
                onChange={(e) => updateOptionalExtra(index, 'youNeedToKnow', e.target.value)}
                placeholder="Enter important information guests need to know..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor={`we-should-mention-${index}`}>We Should Mention</Label>
              <Textarea
                id={`we-should-mention-${index}`}
                value={item.weShouldMention}
                onChange={(e) => updateOptionalExtra(index, 'weShouldMention', e.target.value)}
                placeholder="Enter additional information we should mention..."
                rows={3}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addOptionalExtra} className="flex items-center gap-2">
          <Plus size={16} />
          Add Extra Information
        </Button>
      </CardContent>
    </Card>
  );
};
