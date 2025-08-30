'use client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

interface DetailsSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const DetailsSection = ({ formData, handleInputChange }: DetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">About</Label>
        <Textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} placeholder="Enter hotel description..." />
      </div>

      <div>
        <Label className="text-lg font-medium">What You Need to Know</Label>
        <div className="space-y-3">
          {formData.optionalExtras &&
            formData.optionalExtras.map((extra: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newExtras = formData.optionalExtras.filter((_: any, i: number) => i !== index);
                      handleInputChange('optionalExtras', newExtras);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>What You Need to Know</Label>
                    <Input
                      value={extra.youNeedToKnow || ''}
                      onChange={(e) => {
                        const newExtras = [...formData.optionalExtras];
                        newExtras[index] = { ...extra, youNeedToKnow: e.target.value };
                        handleInputChange('optionalExtras', newExtras);
                      }}
                      placeholder="Enter what guests need to know..."
                    />
                  </div>
                  <div>
                    <Label>Additional Information</Label>
                    <Textarea
                      value={extra.weShouldMention || ''}
                      onChange={(e) => {
                        const newExtras = [...formData.optionalExtras];
                        newExtras[index] = { ...extra, weShouldMention: e.target.value };
                        handleInputChange('optionalExtras', newExtras);
                      }}
                      rows={2}
                      placeholder="Enter additional information..."
                    />
                  </div>
                </div>
              </div>
            ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newExtras = formData.optionalExtras || [];
              handleInputChange('optionalExtras', [...newExtras, { youNeedToKnow: '', weShouldMention: '' }]);
            }}
            className="w-full"
          >
            Add New Item
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium">Languages Spoken</Label>
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
                placeholder="Enter language..."
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
    </div>
  );
};
