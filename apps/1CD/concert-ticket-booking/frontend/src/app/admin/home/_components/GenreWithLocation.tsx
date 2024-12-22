'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsDown } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { EventInputType } from '@/utils/validation-schema';
import { UseFormReturn } from 'react-hook-form';
import { useGetArenaQuery, useGetCategoriesQuery } from '@/generated';
import { cn } from '@/utils/utils';

type FormProps = {
  form: UseFormReturn<EventInputType>;
};

const InputGenreWithLocation = ({ form }: FormProps) => {
  const { data: arenaData } = useGetArenaQuery();
  const { data: categoryData } = useGetCategoriesQuery();

  return (
    <div className="flex justify-between my-4">
      <div className="w-[250px]" data-testid="venue-select-container">
        <FormField
          data-testid="venue-select-item"
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Байршил <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="venue-select">
                    <SelectValue placeholder="Байршил сонгох" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {arenaData?.getArena?.map((item, index) => (
                    <SelectItem key={item?._id} value={item!._id} data-testid={`arena-item-${index}`}>
                      {item?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
      <div className="w-[250px]" data-testid="category-select-container">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Тоглолтын төрөл <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('w-[250px] justify-between', field.value?.length === 0 && 'text-muted-foreground')} data-testid="category-button">
                      {field.value.length > 0 ? field.value.map((id) => categoryData?.getCategories.find((category) => category._id === id)?.name).join(', ') : 'Тоглолтын төрөл'}
                      <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {categoryData?.getCategories.map((item, index) => (
                          <CommandItem
                            key={item._id}
                            onSelect={() => {
                              // Update the field with category _id instead of the name
                              const newCategory = field.value.includes(item._id) ? field.value.filter((id) => id !== item._id) : [...field.value, item._id];
                              field.onChange(newCategory);
                            }}
                            data-testid={`category-item-${index}`}
                          >
                            <label className="flex items-center space-x-2">
                              <span className="text-sm">{item.name}</span>
                            </label>
                            <Check className={cn('ml-auto', field.value.includes(item._id) ? 'opacity-100' : 'opacity-0')} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default InputGenreWithLocation;
