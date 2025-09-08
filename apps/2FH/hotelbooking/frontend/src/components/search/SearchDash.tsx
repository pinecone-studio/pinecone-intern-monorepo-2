import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SearchDashProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedStars: string;
  setSelectedStars: React.Dispatch<React.SetStateAction<string>>;
  selectedRating: string;
  setSelectedRating: React.Dispatch<React.SetStateAction<string>>;
  amenities: string;
  setAmenities: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchDash = ({ search, setSearch, selectedStars, setSelectedStars, selectedRating, setSelectedRating, amenities, setAmenities }: SearchDashProps) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="w-60 flex flex-col gap-y-2 ">
      <p className="text-sm font-medium">Search by property name </p>
      <div className="w-full  rounded-md">
        <Input data-testid="search-input" placeholder="Search" value={search} onChange={handleSearch} />
      </div>
      <div className="border mb-4 mt-4"></div>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-5">
          <p className="text-sm font-medium">Rating</p>
          <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="9" id="9-rating" />
              <Label htmlFor="9-rating" className="font-medium text-sm">
                +9
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="8" id="8-rating" />
              <Label htmlFor="8-rating" className="font-medium text-sm">
                +8
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="7-rating" />
              <Label htmlFor="7-rating" className="font-medium text-sm">
                +7
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-y-5">
          <p className="text-sm font-medium">Stars</p>
          <RadioGroup value={selectedStars} onValueChange={setSelectedStars}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="5-stars" />
              <Label htmlFor="5-stars" className="font-medium text-sm">
                5 Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="4-stars" />
              <Label htmlFor="4-stars" className="font-medium text-sm">
                4 Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="3-stars" />
              <Label htmlFor="3-stars" className="font-medium text-sm">
                3 Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="2-stars" />
              <Label htmlFor="2-stars" className="font-medium text-sm">
                2 Stars
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-y-5">
          <p className="text-sm font-medium">Amenities</p>
          <RadioGroup value={amenities} onValueChange={setAmenities}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pet-friendly" id="pet-friendly" />
              <Label htmlFor="pet-friendly" className="font-medium text-sm">
                Pet friendly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="airport-shuttle" id="airport-shuttle" />
              <Label htmlFor="airport-shuttle" className="font-medium text-sm">
                Airport shuttle included
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pool" id="pool" />
              <Label htmlFor="pool" className="font-medium text-sm">
                Pool
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
