'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const InterestedIn = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 h-screen flex flex-col items-center">
        <h1 className="text-3xl font-bold m-10">🔥 tinder</h1>
        <h1 className="text-3xl font-semibold">
          Who are you interested in?
        </h1>
        <p className="text-gray-500 text-sm">
          Pick the one that feels right for you!
        </p>

        <Select>
          <SelectTrigger className="w-[450px] m-10">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="border rounded-full text-white bg-red-500 ml-auto mr-[150px]"
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InterestedIn;
