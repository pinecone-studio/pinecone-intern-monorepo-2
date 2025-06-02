import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectStartTime } from '@/app/(admin)/ticket/_components/SelectStartTime'; 
import { useForm, FormProvider } from 'react-hook-form';
import '@testing-library/jest-dom';
describe('SelectStartTime', () => {
  const renderWithForm = (props: any) => {
    const Wrapper = () => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <SelectStartTime {...props} />
        </FormProvider>
      );
    };
    render(<Wrapper />);
  };

  const hourOptions = ['10:00', '11:00', '12:00'];
  const getHourNumber = (t: string) => parseInt(t.split(':')[0]);

  it('renders all hour options', () => {
    renderWithForm({
      startHour: '',
      endHour: '',
      setStartHour: jest.fn(),
      setEndHour: jest.fn(),
      getHourNumber,
      hourOptions,
    });

    fireEvent.mouseDown(screen.getByTestId('select-trigger'));
    hourOptions.forEach((hour) => {
      expect(screen.getByTestId(`select-hour-${hour}`)).toBeInTheDocument();
    });
  });

  it('calls setStartHour with selected value', () => {
    const setStartHour = jest.fn();
    renderWithForm({
      startHour: '',
      endHour: '',
      setStartHour,
      setEndHour: jest.fn(),
      getHourNumber,
      hourOptions,
    });

    fireEvent.mouseDown(screen.getByTestId('select-trigger'));
    fireEvent.click(screen.getByTestId('select-hour-11:00'));
    expect(setStartHour).toHaveBeenCalledWith('11:00');
  });

  it('clears endHour if it is before or equal to selected startHour', () => {
    const setEndHour = jest.fn();
    renderWithForm({
      startHour: '',
      endHour: '10:00',
      setStartHour: jest.fn(),
      setEndHour,
      getHourNumber,
      hourOptions,
    });

    fireEvent.mouseDown(screen.getByTestId('select-trigger'));
    fireEvent.click(screen.getByTestId('select-hour-11:00'));

    // Энд endHour нь 10:00 байсан бөгөөд 11:00-г сонгосон тул арилгах ёстой
    expect(setEndHour).toHaveBeenCalledWith('');
  });

  it('does not clear endHour if it is after selected startHour', () => {
    const setEndHour = jest.fn();
    renderWithForm({
      startHour: '',
      endHour: '12:00',
      setStartHour: jest.fn(),
      setEndHour,
      getHourNumber,
      hourOptions,
    });

    fireEvent.mouseDown(screen.getByTestId('select-trigger'));
    fireEvent.click(screen.getByTestId('select-hour-11:00'));

    expect(setEndHour).not.toHaveBeenCalledWith('');
  });
});
