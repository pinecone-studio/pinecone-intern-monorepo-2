import { DialogInputs } from '@/app/profile-setup/_components/DialogInputs';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockFormik = {
  values: {
    interests: [],
  },
  setFieldValue: jest.fn(),
};

describe('DialogInputs', () => {
  beforeEach(() => {
    mockFormik.values.interests = [];
    mockFormik.setFieldValue.mockClear();
  });

  it('renders button to open dialog', () => {
    render(<DialogInputs formik={mockFormik} />);
    expect(screen.getByRole('button', { name: /Select Interests/i })).toBeInTheDocument();
  });

  it('limits selection to 5 interests', () => {
    render(<DialogInputs formik={mockFormik} />);

    const openBtn = screen.getByRole('button', { name: /Select Interests/i });
    fireEvent.click(openBtn);

    const interestButtons = screen.getAllByRole('button').filter(btn => {
      const text = btn.textContent || '';
      return text && !text.toLowerCase().includes('select') && !text.toLowerCase().includes('save');
    });

    const selectedInterests: string[] = [];

    for (const btn of interestButtons) {
      if (selectedInterests.length >= 5) break;
      if (btn.getAttribute('disabled') === null) {
        fireEvent.click(btn);
        selectedInterests.push(btn.textContent || '');
      }
    }

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveBtn);

    expect(mockFormik.setFieldValue).toHaveBeenCalledWith('interests', selectedInterests);
  });
});
