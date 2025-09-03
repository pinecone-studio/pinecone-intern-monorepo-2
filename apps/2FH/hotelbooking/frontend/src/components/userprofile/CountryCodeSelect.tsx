import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { countryCodes } from "./countryCodes";

interface CountryCodeSelectProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function CountryCodeSelect({ defaultValue = "+976", onValueChange }: CountryCodeSelectProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.code} ({country.country})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
