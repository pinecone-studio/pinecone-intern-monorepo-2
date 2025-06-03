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
    <FormItem data-testid="form-item">
      <FormLabel data-testid="form-label">{label}</FormLabel>
      <FormControl>
        <Input data-testid='input' data-cy={`input-${label}`} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};