import React, { useState } from 'react';
import { Calendar, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface SearchParams {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

interface SearchHomeProps {
  onSearch: (params: SearchParams) => void;
  initialLocation?: string;
}

export const SearchHome = ({ onSearch, initialLocation = '' }: SearchHomeProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: initialLocation,
    checkIn: undefined,
    checkOut: undefined,
    guests: {
      adults: 1,
      children: 0,
      rooms: 1,
    },
  });

  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  };

  const updateGuests = (type: keyof SearchParams['guests'], value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(type === 'adults' || type === 'rooms' ? 1 : 0, value),
      },
    }));
  };

  const formatGuestsText = (): string => {
    const { adults, children, rooms } = searchParams.guests;
    const totalGuests = adults + children;
    return `${totalGuests} traveler${totalGuests !== 1 ? 's' : ''}, ${rooms} room${rooms !== 1 ? 's' : ''}`;
  };

  const handleSearch = () => {
    if (!searchParams.location.trim()) {
      alert('Please enter a location');
      return;
    }

    if (!searchParams.checkIn || !searchParams.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (searchParams.checkIn >= searchParams.checkOut) {
      alert('Check-out date must be after check-in date');
      return;
    }

    onSearch(searchParams);
  };

  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center pt-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the Best Hotel for Your Stay</h1>
        <p className="text-xl text-blue-100 mb-8">Book from a wide selection of hotels for your next trip.</p>

        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Location Search */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchParams.location}
                onChange={(e) => updateSearchParams({ location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Check-in Date */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-in
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal p-3 h-auto">
                    <Calendar className="w-4 h-4 mr-2" />
                    {searchParams.checkIn ? format(searchParams.checkIn, 'MMM dd') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchParams.checkIn}
                    onSelect={(date) => updateSearchParams({ checkIn: date })}
                    disabled={(date) => {
                      const minDate = searchParams.checkIn || new Date();
                      return date <= minDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal p-3 h-auto">
                    <Calendar className="w-4 h-4 mr-2" />
                    {searchParams.checkOut ? format(searchParams.checkOut, 'MMM dd') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchParams.checkOut}
                    onSelect={(date) => updateSearchParams({ checkOut: date })}
                    disabled={(date) => date <= (searchParams.checkIn || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests & Rooms */}
            <div className="text-left relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Guests & Rooms
              </label>
              <Popover open={showGuestSelector} onOpenChange={setShowGuestSelector}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal p-3 h-auto">
                    <Users className="w-4 h-4 mr-2" />
                    {formatGuestsText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Adults</span>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={() => updateGuests('adults', searchParams.guests.adults - 1)} disabled={searchParams.guests.adults <= 1}>
                          −
                        </Button>
                        <span className="w-8 text-center">{searchParams.guests.adults}</span>
                        <Button variant="outline" size="sm" onClick={() => updateGuests('adults', searchParams.guests.adults + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Children</span>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={() => updateGuests('children', searchParams.guests.children - 1)} disabled={searchParams.guests.children <= 0}>
                          −
                        </Button>
                        <span className="w-8 text-center">{searchParams.guests.children}</span>
                        <Button variant="outline" size="sm" onClick={() => updateGuests('children', searchParams.guests.children + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Rooms</span>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={() => updateGuests('rooms', searchParams.guests.rooms - 1)} disabled={searchParams.guests.rooms <= 1}>
                          −
                        </Button>
                        <span className="w-8 text-center">{searchParams.guests.rooms}</span>
                        <Button variant="outline" size="sm" onClick={() => updateGuests('rooms', searchParams.guests.rooms + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setShowGuestSelector(false)}>
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <div className="md:col-span-4">
              <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg transition-colors duration-200" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Search Hotels
              </Button>
            </div>
          </div>

          {/* Quick Search Suggestions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-2">
              {['Ulaanbaatar', 'Darkhan', 'Erdenet', 'Karakorum', 'Khovd'].map((city) => (
                <button
                  key={city}
                  onClick={() => updateSearchParams({ location: city })}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
