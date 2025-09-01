import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, HelpCircle } from 'lucide-react';
import type { FaqItem } from './types';

export const FaqSection = ({ faq, onFaqChange }: { faq: FaqItem[]; onFaqChange: (_faq: FaqItem[]) => void }) => {
  const addFaq = () => {
    onFaqChange([
      ...faq,
      {
        question: '',
        answer: '',
      },
    ]);
  };

  const removeFaq = (index: number) => {
    onFaqChange(faq.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const newFaq = [...faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    onFaqChange(newFaq);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle size={20} className="text-blue-500" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {faq.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">FAQ {index + 1}</h4>
              {faq.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeFaq(index)}>
                  <X size={16} />
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`faq-question-${index}`}>Question</Label>
              <Input id={`faq-question-${index}`} value={item.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} placeholder="Enter question..." />
            </div>

            <div>
              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
              <Textarea id={`faq-answer-${index}`} value={item.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} placeholder="Enter answer..." rows={3} />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addFaq} className="flex items-center gap-2">
          <Plus size={16} />
          Add FAQ
        </Button>
      </CardContent>
    </Card>
  );
};
