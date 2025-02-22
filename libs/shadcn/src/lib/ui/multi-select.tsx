'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { Command as CommandPrimitive } from 'cmdk';
import { Badge } from './badge';
import { Command, CommandGroup, CommandItem, CommandList } from './command';

type Option = Record<'value' | 'label', string>;

type MultiSelectProps = {
  options: Option[];
  value: Option[];
  onValueChange: (_: Option[]) => void;
  placeholder?: string;
};

export const MultiSelect = ({ options, value, onValueChange, placeholder }: MultiSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = (option: Option) => onValueChange(value.filter((s) => s.value !== option.value));

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          const newSelected = [...value];
          newSelected.pop();
          onValueChange(newSelected);
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter((option) => !value.map((v) => v.value).includes(option.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="px-3 py-2 text-sm bg-white border rounded-md group border-input ring-offset-background">
        <div className="flex flex-wrap gap-1">
          {value.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="flex-1 ml-2 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in">
              <CommandGroup className="h-full overflow-auto max-h-80">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e: { preventDefault: () => void; stopPropagation: () => void }) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        onValueChange([...value, option]);
                      }}
                      className={'cursor-pointer'}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
};
