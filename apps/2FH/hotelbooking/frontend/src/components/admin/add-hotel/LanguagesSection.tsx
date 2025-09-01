import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Globe } from 'lucide-react';

export const LanguagesSection = ({ languages, onLanguagesChange, ...props }: { languages: string[]; onLanguagesChange: (_languages: string[]) => void }) => {
  const addLanguage = () => {
    onLanguagesChange([...languages, '']);
  };

  const removeLanguage = (index: number) => {
    onLanguagesChange(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    onLanguagesChange(newLanguages);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe size={20} className="text-green-500" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {languages.map((language, index) => (
            <div key={index} className="flex gap-2">
              <Input value={language} onChange={(e) => updateLanguage(index, e.target.value)} placeholder="Enter language" required />
              {languages.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeLanguage(index)} data-testid="button">
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLanguage} className="flex items-center gap-2" data-testid="button">
            <Plus size={16} />
            Add Language
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
