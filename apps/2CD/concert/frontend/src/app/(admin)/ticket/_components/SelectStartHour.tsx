/* eslint-disable no-unused-vars */
import { FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SelectStartTime = ({
  startHour,
  getHourNumber,
  setEndHour,
  setStartHour,
  hourOptions,
  endHour,
}: {
  getHourNumber: (timeString: string) => number;
  startHour: string;
  setStartHour: (value: React.SetStateAction<string>) => void;
  setEndHour: (value: React.SetStateAction<string>) => void;
  hourOptions: string[];
  endHour: string;
}) => {
  return (
    <FormItem data-testid="form-item" className="flex flex-col">
      <FormLabel data-testid="form-label">эхлэх цаг*</FormLabel>
      <Select
        data-testid="select"
        value={startHour}
        onValueChange={(value) => {
          setStartHour(value);
          if (endHour && getHourNumber(endHour) <= getHourNumber(value)) {
            setEndHour('');
          }
        }}
      >
        <SelectTrigger data-testid="select-trigger" data-cy="select-trigger-start" className="w-[140px]">
          <SelectValue data-testid="select-value" placeholder="Эхлэх цаг" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem data-testid={`select-hour-${hour}`} data-cy={`select-start-hour-${hour}`} key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};
