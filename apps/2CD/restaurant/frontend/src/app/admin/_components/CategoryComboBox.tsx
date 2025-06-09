import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../_utils/cn';
const GET_ALL_CATEGORY = gql`
  query GetAllCategory {
    getAllCategory {
      _id
      name
    }
  }
`;
export const CategoryCombo = ({ value, onChange }: { value: string; onChange: (_val: string) => void }) => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORY);
  const [open, setOpen] = useState(false);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;
  return (
    <div>
      <h1 className="h-10">Цэсийг тохируулах</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {value ? data.getAllCategory.find((category: { _id: string; name: string }) => category._id === value)?.name : 'Select category...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {data.getAllCategory.map((category: { _id: string; name: string }) => (
                  <CommandItem
                    key={category._id}
                    value={category._id}
                    onSelect={(_val) => {
                      onChange(_val === value ? '' : _val);
                      setOpen(false);
                    }}
                  >
                    {category.name}
                    <Check className={cn('ml-auto', value === category._id ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
