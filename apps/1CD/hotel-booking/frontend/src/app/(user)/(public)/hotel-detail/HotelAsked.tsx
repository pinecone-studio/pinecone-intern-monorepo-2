'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Hotel } from '@/generated';

const HotelAsked = ({ hotel }: { hotel: Hotel | undefined }) => {
  return (
    <div className="flex gap-20">
      <div className="w-[264px] text-lg font-semibold text-gray-500">Frequently asked questions</div>
      <Accordion type="single" collapsible data-cy="Hotel-Asked" className="flex-1 w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger data-cy="hotel-ask-trigger" className="text-base font-medium">
            Is {hotel?.hotelName} pet-friendly?
          </AccordionTrigger>
          <AccordionContent data-cy="hotel-ask-question" className="text-sm font-normal">
            Yes. We welcome to pets.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base font-medium">How much is parking at {hotel?.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal text-[#09090B]">Self parking is free at this property.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-base font-medium">What time is check-in at {hotel?.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Check-in is anytime.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-base font-medium">What time is check-out at {hotel?.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Check-out at 12:00 pm</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-base font-medium">Does {hotel?.hotelName} provide a shuttle to the airport?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Yes. We have bus and Vip car.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-base font-medium">Where is {hotel?.hotelName} located?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">{hotel?.location} </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default HotelAsked;
