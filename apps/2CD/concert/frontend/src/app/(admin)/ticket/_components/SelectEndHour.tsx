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
    <FormItem data-testid="form-item" className="flex flex-col">
      <FormLabel data-testid="form-label">дуусах цаг*</FormLabel>
      <Select data-testid="select" value={endHour} onValueChange={setEndHour}>
        <SelectTrigger data-testid="select-trigger" data-cy="select-trigger-end" className="w-[140px]">
          <SelectValue data-testid="select-value" placeholder="Дуусах цаг" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem data-testid={`select-hour-${hour}`} data-cy={`select-end-hour-${hour}`} key={hour} value={hour} disabled={isEndTimeDisabled(hour)}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};
