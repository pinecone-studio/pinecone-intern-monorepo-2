/* eslint-disable no-unused-vars */
import { FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SelectEndHour = ({
  endHour,
  setEndHour,
  hourOptions,
  isEndTimeDisabled,
}: {
  endHour: string;
  setEndHour: React.Dispatch<React.SetStateAction<string>>;
  hourOptions: string[];
  isEndTimeDisabled: (endTime: string) => boolean;
}) => {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>дуусах цаг*</FormLabel>
      <Select value={endHour} onValueChange={setEndHour}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Дуусах цаг" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem key={hour} value={hour} disabled={isEndTimeDisabled(hour)}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};
