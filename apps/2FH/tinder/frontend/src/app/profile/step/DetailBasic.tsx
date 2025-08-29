'use client';

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

const DetailBasic = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 h-screen flex flex-col items-center">
        <h1 className="text-3xl font-bold m-10">🔥 tinder</h1>
        <h1 className="text-3xl font-semibold">How old are you?</h1>
        <p className="text-gray-500 text-sm mt-5">
          Please provide the following information to help us get to know you better.
        </p>

        <div className="flex flex-col m-10">
          <p className="text-sm">Name</p>
          <Input type="text" placeholder="Enter your name" className="w-[450px] mb-5" />

          <p className="text-sm">Bio</p>
          <Input type="text" placeholder="Tell us about yourself" className="w-[450px] mb-5" />

          <p className="text-sm">Interests</p>
          <Input type="text" placeholder="What are you interested in?" className="w-[450px] mb-5" />

          <p className="text-sm">Profession</p>
          <Input type="text" placeholder="Enter your profession" className="w-[450px] mb-5" />

          <p className="text-sm">School and Work</p>
          <Input type="text" placeholder="Where do you study or work?" className="w-[450px] mb-5" />
        </div>

        <div className="flex justify-around w-full">
          <Button
            variant="outline"
            className="border rounded-full text-white bg-red-500"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            variant="outline"
            className="border rounded-full text-white bg-red-500"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailBasic;
