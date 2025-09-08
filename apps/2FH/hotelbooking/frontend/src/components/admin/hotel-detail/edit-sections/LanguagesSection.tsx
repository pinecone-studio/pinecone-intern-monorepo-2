'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LanguagesSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const LanguagesSection = ({ formData, handleInputChange }: LanguagesSectionProps) => {
  return (
    <div className="space-y-4">
      <Label>Languages</Label>
      <div className="space-y-2">
        {formData.languages.map((language: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={language}
              onChange={(e) => {
                const newLanguages = [...formData.languages];
                newLanguages[index] = e.target.value;
                handleInputChange('languages', newLanguages);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleInputChange(
                  'languages',
                  formData.languages.filter((_: string, i: number) => i !== index)
                );
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            handleInputChange('languages', [...formData.languages, '']);
          }}
        >
          Add Language
        </Button>
      </div>
    </div>
  );
};
