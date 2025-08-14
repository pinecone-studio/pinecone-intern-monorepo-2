import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ButtonNextPrevious } from '../ButtonNextPrevious';
import { Label } from '@radix-ui/react-label';
import { Props } from '@/app/global';

export const SelectInterest = ({ nextPage }: Props) => {
  return (
    <div className="bg-white p-6">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Who are you interested in?</h1>
          <p className="text-[#71717A] text-[14px] font-normal">Pick the one that feels right for you!</p>
        </div>

        <div className="w-full ">
          <Label className="sr-only" htmlFor="interest">
            Interest
          </Label>
          <div className="relative">
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ButtonNextPrevious nextPage={nextPage} />
      </div>
    </div>
  );
};
