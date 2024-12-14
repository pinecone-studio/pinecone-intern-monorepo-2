import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form'; // Import FormProvider
import TimePicker from '../../../src/app/admin/home/TimePicker'; // TimePicker component
import { EventInputType } from '@/utils/validation-schema';
import EventModal from '../../../src/app/admin/home/EventModal'; // The modal component

jest.mock('@/utils/generateTime', () => ({
  generateHours: jest.fn(() => ['01', '02', '03', '04']),
  generateMinutes: jest.fn(() => ['00', '15', '30', '45']),
}));

describe('TimePicker inside Modal', () => {
  let form;

  beforeEach(() => {
    // Initialize the form using react-hook-form's useForm hook
    const { result } = renderHook(() => useForm<EventInputType>());
    form = result.current;

    // Render the modal and time picker
    render(
      <FormProvider {...form}>
        <EventModal>
          <TimePicker form={form} />
        </EventModal>
      </FormProvider>
    );
  });

  test('renders time picker with hour and minute select fields when modal is opened', () => {
    // Simulate opening the modal if necessary
    // This depends on how your modal is structured. For example:
    const openButton = screen.getByTestId('open-modal-button');
    fireEvent.click(openButton);

    // Ensure that the hour and minute select fields are rendered inside the modal
    expect(screen.getByTestId('hour-select')).toBeInTheDocument();
    expect(screen.getByTestId('minute-select')).toBeInTheDocument();
  });
});
