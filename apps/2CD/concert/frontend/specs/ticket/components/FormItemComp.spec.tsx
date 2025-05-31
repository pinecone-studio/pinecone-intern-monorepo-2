import { render, screen } from '@testing-library/react';
import { useForm, Controller } from 'react-hook-form';
import { FormItemComp } from '@/app/(admin)/ticket/_components';

type FormData = {
  username: string;
};

const Wrapper = () => {
  const { control } = useForm<FormData>({
    defaultValues: { username: 'testuser' },
  });

  return (
    <form>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <FormItemComp<FormData, 'username'> label="Username" field={field} />
        )}
      />
    </form>
  );
};

describe('FormItemComp', () => {
  it('renders the label and input', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText(/username/i))
    expect(screen.getByDisplayValue('testuser'))
  });
});
