import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SettingsSvg } from '../../../src/components/assets/SettingsSvg';

describe('SettingsSvg Component', () => {
  it('should render successfully', () => {
    const { container } = render(<SettingsSvg />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct SVG attributes', () => {
    const { container } = render(<SettingsSvg />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('should contain two path elements for settings icon', () => {
    const { container } = render(<SettingsSvg />);
    const paths = container.querySelectorAll('path');
    
    expect(paths).toHaveLength(2);
    
    paths.forEach(path => {
      expect(path).toHaveAttribute('stroke', '#09090B');
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });
  });

  it('should have the correct path data for settings gear icon', () => {
    const { container } = render(<SettingsSvg />);
    const paths = container.querySelectorAll('path');
    
    expect(paths[0]).toHaveAttribute('d', expect.stringContaining('M12.22 2H11.78C11.2496 2'));
    
    expect(paths[1]).toHaveAttribute('d', 'M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z');
  });

  it('should render without errors', () => {
    expect(() => render(<SettingsSvg />)).not.toThrow();
  });
});
