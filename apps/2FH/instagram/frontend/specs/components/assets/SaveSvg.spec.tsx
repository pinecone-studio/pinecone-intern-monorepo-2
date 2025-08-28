import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SaveSvg } from '../../../src/components/assets/SaveSvg';

describe('SaveSvg Component', () => {
  it('should render successfully', () => {
    const { container } = render(<SaveSvg />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct SVG attributes', () => {
    const { container } = render(<SaveSvg />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '17');
    expect(svg).toHaveAttribute('viewBox', '0 0 16 17');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('should contain the correct path element', () => {
    const { container } = render(<SaveSvg />);
    const path = container.querySelector('path');
    
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke', '#18181B');
    expect(path).toHaveAttribute('stroke-opacity', '0.5');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('should have the correct path data for bookmark icon', () => {
    const { container } = render(<SaveSvg />);
    const path = container.querySelector('path');
    const expectedPath = 'M12.6668 14.5L8.00016 11.8333L3.3335 14.5V3.83333C3.3335 3.47971 3.47397 3.14057 3.72402 2.89052C3.97407 2.64048 4.31321 2.5 4.66683 2.5H11.3335C11.6871 2.5 12.0263 2.64048 12.2763 2.89052C12.5264 3.14057 12.6668 3.47971 12.6668 3.83333V14.5Z';
    
    expect(path).toHaveAttribute('d', expectedPath);
  });

  it('should render without errors', () => {
    expect(() => render(<SaveSvg />)).not.toThrow();
  });
});
