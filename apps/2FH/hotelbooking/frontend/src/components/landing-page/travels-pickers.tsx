"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Minus, Plus } from "lucide-react";

export type TravelsPickerProps = {
  adults: number;
  rooms: number;
  onChange: (next: { adults: number; rooms: number }) => void;
};

export default function TravelsPicker({ adults, rooms, onChange }: TravelsPickerProps) {
  const [open, setOpen] = useState(true);

  console.log('Component render - open state:', open);

  const summary = `${adults} ${adults === 1 ? "traveller" : "travellers"}, ${rooms} ${rooms === 1 ? "room" : "rooms"}`;

  const decrement = (key: "adults" | "rooms") => {
    console.log('Decrement called for:', key, 'Current adults:', adults, 'Current rooms:', rooms);
    const value = key === "adults" ? Math.max(1, adults - 1) : Math.max(1, rooms - 1);
    console.log('New value:', value);
    onChange({ adults: key === "adults" ? value : adults, rooms: key === "rooms" ? value : rooms });
  };

  const increment = (key: "adults" | "rooms") => {
    console.log('Increment called for:', key, 'Current adults:', adults, 'Current rooms:', rooms);
    const value = key === "adults" ? adults + 1 : rooms + 1;
    console.log('New value:', value);
    onChange({ adults: key === "adults" ? value : adults, rooms: key === "rooms" ? value : rooms });
  };

  return (
    <div className="relative">
      <button 
        className="w-full h-12 flex justify-between items-center px-4 text-black bg-white border border-gray-300 hover:bg-gray-50 rounded-xl"
        onClick={() => {
          console.log('Button clicked, current open state:', open);
          setOpen(!open);
          console.log('New open state will be:', !open);
        }}
      >
        <span className="truncate text-left font-medium">{summary}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
      </button>
      
      {open && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Travels</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="text-base font-medium text-gray-700">Adult</div>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-10 w-10 rounded-full border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center cursor-pointer bg-white"
                    onClick={() => decrement("adults")}
                  > 
                    <Minus className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="w-8 text-center text-lg font-semibold">{adults}</span>
                  <div 
                    className="h-10 w-10 rounded-full border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center cursor-pointer bg-white"
                    onClick={() => increment("adults")}
                  > 
                    <Plus className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              </div>

            <div className="flex items-center justify-between py-2">
                <div className="text-base font-medium text-gray-700">Rooms</div>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-10 w-10 rounded-full border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center cursor-pointer bg-white"
                    onClick={() => decrement("rooms")}
                  > 
                    <Minus className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="w-8 text-center text-lg font-semibold">{rooms}</span>
                  <div 
                    className="h-10 w-10 rounded-full border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center cursor-pointer bg-white"
                    onClick={() => increment("rooms")}
                  > 
                    <Plus className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                onClick={() => setOpen(false)} 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-xl font-medium"
              >
                Done
              </Button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
} 
