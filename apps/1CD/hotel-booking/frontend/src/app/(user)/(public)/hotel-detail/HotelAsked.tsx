'use client';
import { useGetHotelQuery } from '@/generated';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HotelAsked = () => {
  const { data } = useGetHotelQuery({
    variables: {
      id: '674bfbd6a111c70660b55541',
    },
  });
  return (
    <div className="flex gap-20" >
      <div className="w-[264px] text-2xl font-semibold">Frequently asked questions</div>
      <Accordion type="single" collapsible className="w-full" data-cy="Hotel-Asked">
        <AccordionItem value="item-1">
          <AccordionTrigger data-cy="hotel-ask-trigger" className="text-base font-medium">Is {data?.getHotel.hotelName} pet-friendly?</AccordionTrigger>
          <AccordionContent data-cy="hotel-ask-question" className="text-sm font-normal">Yes. We welcome to pets.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base font-medium">How much is parking at {data?.getHotel.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal text-[#09090B]">Self parking is free at this property.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-base font-medium">What time is check-in at {data?.getHotel.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Check-in is anytime.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-base font-medium">What time is check-out at {data?.getHotel.hotelName}?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Check-out at 12:00 pm</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-base font-medium">Does {data?.getHotel.hotelName}provide a shuttle to the airport?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">Yes. We have bus and Vip car.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-base font-medium">Where is {data?.getHotel.hotelName} located?</AccordionTrigger>
          <AccordionContent className="text-sm font-normal">{data?.getHotel.location}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default HotelAsked;
