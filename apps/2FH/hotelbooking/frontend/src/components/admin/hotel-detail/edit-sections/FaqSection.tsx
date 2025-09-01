'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

interface FAQSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const FAQSection = ({ formData, handleInputChange }: FAQSectionProps) => {
  return (
    <div className="space-y-4">
      {formData.faq.map((faq: any, index: number) => (
        <div key={index} className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">FAQ {index + 1}</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleInputChange(
                  'faq',
                  formData.faq.filter((_: any, i: number) => i !== index)
                );
              }}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input
                value={faq.question}
                onChange={(e) => {
                  const newFAQ = [...formData.faq];
                  newFAQ[index] = { ...faq, question: e.target.value };
                  handleInputChange('faq', newFAQ);
                }}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={faq.answer}
                onChange={(e) => {
                  const newFAQ = [...formData.faq];
                  newFAQ[index] = { ...faq, answer: e.target.value };
                  handleInputChange('faq', newFAQ);
                }}
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          handleInputChange('faq', [...formData.faq, { question: '', answer: '' }]);
        }}
        className="w-full"
      >
        Add New FAQ
      </Button>
    </div>
  );
};
