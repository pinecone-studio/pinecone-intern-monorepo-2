import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

type FormItemCompProps<T extends FieldValues, K extends Path<T>> = {
  label: string;
  field: ControllerRenderProps<T, K>;
};

export const FormItemComp = <T extends FieldValues, K extends Path<T>>({
  label,
  field,
}: FormItemCompProps<T, K>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
