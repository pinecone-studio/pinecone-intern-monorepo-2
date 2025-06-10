import { TextInputs } from '@/app/profile-setup/_components/TextInputs';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFormik = {
  values: {
    firstName: '',
    age: '',
    bio: '',
    profession: '',
    education: '',
  },
  errors: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};

describe('TextInputs', () => {
  it('renders all input fields', () => {
    render(<TextInputs formik={mockFormik} />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profession/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Education/i)).toBeInTheDocument();
  });

  it('calls formik handlers on input change', () => {
    render(<TextInputs formik={mockFormik} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.blur(screen.getByLabelText(/First Name/i));

    expect(mockFormik.handleChange).toHaveBeenCalled();
    expect(mockFormik.handleBlur).toHaveBeenCalled();
  });
});
