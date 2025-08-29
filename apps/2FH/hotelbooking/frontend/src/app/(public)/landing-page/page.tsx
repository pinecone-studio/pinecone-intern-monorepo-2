"use client";

import { useMemo, useState } from "react";
import { useHotelsQuery } from "@/generated";
import LandingHeader from "@/components/landing-page/landing-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Section } from "@/components/landing-page/section";
import { HotelCard } from "@/components/landing-page/hotel-card";
import Footer from "@/components/landing-page/footer";

function HotelsSection() {
  const { data, loading, error } = useHotelsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-[1160px] mx-auto px-4 mt-6">
      <Section title="Popular Hotels" actionText="View all" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.hotels.map((h: any) => (
          <HotelCard key={h.id} {...h} />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const dateLabel = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMMM dd")} - ${format(dateRange.to, "MMMM dd")}`;
    }
    return "Select dates";
  }, [dateRange]);

  return (
      <div className="w-full">
        <LandingHeader />
        <div className="bg-[#013B94] min-h-[241px] text-white py-12">
          <div className="max-w-[1160px] mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">Find the Best Hotel for Your Stay</h1>
            <p className="mt-2 text-center">Book from a wide selection of hotels for your next trip.</p>

            <div className="bg-white p-4 w-full rounded-md shadow-md mt-6 inline-flex gap-4 items-end">
              <div className="flex-1 text-black">
                <p className="text-sm font-medium text-[#09090B] mb-1">Dates</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full max-w-[700px] h-[44px] text-black justify-start">
                      {dateLabel}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2">
                      <Calendar
                        mode="range"
                        numberOfMonths={2}
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange(range)}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 text-black">
                <p className="text-sm font-medium text-[#09090B] mb-1">Guest</p>
                <Select>
                  <SelectTrigger className="w-full max-w-[420px] h-[44px] text-black">
                    <SelectValue placeholder="1 traveler, 1 room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-1">1 traveler, 1 room</SelectItem>
                    <SelectItem value="2-1">2 travelers, 1 room</SelectItem>
                    <SelectItem value="2-2">2 travelers, 2 rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 text-white h-[44px] px-6 rounded">Search</Button>
            </div>
          </div>
        </div>

        <HotelsSection />
        <Footer />
      </div>
  );
}
