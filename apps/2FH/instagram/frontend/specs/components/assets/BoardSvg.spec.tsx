import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BoardSvg } from '../../../src/components/assets/BoardSvg';

describe('BoardSvg Component', () => {
  it('should render successfully', () => {
    const { container } = render(<BoardSvg />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct SVG attributes', () => {
    const { container } = render(<BoardSvg />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '17');
    expect(svg).toHaveAttribute('height', '17');
    expect(svg).toHaveAttribute('viewBox', '0 0 17 17');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('should contain the correct path element', () => {
    const { container } = render(<BoardSvg />);
    const path = container.querySelector('path');
    
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke', '#09090B');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('should have the correct path data', () => {
    const { container } = render(<BoardSvg />);
    const path = container.querySelector('path');
    const expectedPath = 'M2.21875 6.5H14.2188M2.21875 10.5H14.2188M6.21875 2.5V14.5M10.2188 2.5V14.5M3.55208 2.5H12.8854C13.6218 2.5 14.2188 3.09695 14.2188 3.83333V13.1667C14.2188 13.903 13.6218 14.5 12.8854 14.5H3.55208C2.8157 14.5 2.21875 13.903 2.21875 13.1667V3.83333C2.21875 3.09695 2.8157 2.5 3.55208 2.5Z';
    
    expect(path).toHaveAttribute('d', expectedPath);
  });
});
