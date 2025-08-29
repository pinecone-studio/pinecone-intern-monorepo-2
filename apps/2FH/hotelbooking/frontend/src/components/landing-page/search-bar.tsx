"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import TravelsPicker from "./travels-pickers";

export type SearchBarProps = {
  onSearch: (searchData: { adults: number; rooms: number }) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [travels, setTravels] = useState({ adults: 1, rooms: 1 });

  const handleSearch = () => {
    onSearch(travels);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-yellow-400 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Date Input with Calendar Icon */}
          <div className="flex-1">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Check-in date"
                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Travels Picker */}
          <div className="flex-1">
            <TravelsPicker
              adults={travels.adults}
              rooms={travels.rooms}
              onChange={setTravels}
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl font-medium"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
} 
