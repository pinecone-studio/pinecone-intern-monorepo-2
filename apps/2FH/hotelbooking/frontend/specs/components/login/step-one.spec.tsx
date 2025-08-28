import { StepOne } from '@/components/login/_components/StepOne';
import { render, screen } from '@testing-library/react';

describe('StepOne Component', () => {
  it('should render StepOne correctly', () => {
    render(<StepOne />);

    const container = screen.getByTestId('step-one-container');

    expect(container);
    // expect(container).toHaveTextContent('login step one');
  });
});
