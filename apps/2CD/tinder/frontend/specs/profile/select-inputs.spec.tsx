import { SelectInputs } from '@/app/profile-setup/_components/SelectInputs';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFormik = {
  values: {
    gender: '',
    lookingFor: '',
  },
  errors: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};

describe('SelectInputs', () => {
  it('renders select fields for gender and lookingFor', () => {
    render(<SelectInputs formik={mockFormik} />);
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Looking For/i)).toBeInTheDocument();
  });

  it('calls formik handlers on select change', () => {
    render(<SelectInputs formik={mockFormik} />);
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });

    expect(mockFormik.handleChange).toHaveBeenCalled();
  });
});
