'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Props } from '@/app/global';
import { ButtonNextPrevious } from '../ButtonNextPrevious';

export const YourDetails = ({ nextPage, previousPage }: Props) => {
  return (
    <div className=" bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full  space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Details</h1>
          <p className="text-gray-500">Please provide the following information to help us get to know you better.</p>
        </div>

        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11D48E5] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11D48E5] focus:border-transparent outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <Label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
            Interest
          </Label>
          <Input
            id="interest"
            type="text"
            placeholder="What are your interests?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11D48E5] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
            Profession
          </Label>
          <Input
            id="profession"
            type="text"
            placeholder="Enter your profession"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11D48E5] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="schoolWork" className="block text-sm font-medium text-gray-700 mb-2">
            School/Work
          </Label>
          <Input
            id="schoolWork"
            type="text"
            placeholder="Where do you study or work?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11D48E5] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div className="flex justify-between items-center pt-6">
          <ButtonNextPrevious previousPage={previousPage} />
          <ButtonNextPrevious nextPage={nextPage} />
        </div>
      </div>
    </div>
  );
};
