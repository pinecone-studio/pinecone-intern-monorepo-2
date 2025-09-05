import { EmptySvg } from '@/components/BookingHistory/_components/assets/EmptySvg';
import { render } from '@testing-library/react';

describe('It should render Empty SVG Component', () => {
  it('should render Empty SVG Component', () => {
    const { getByTestId } = render(<EmptySvg />);
    const emptySvgComponent = getByTestId('Empty-SVG-Component');
    expect(emptySvgComponent).toBeInTheDocument();
  });
});
