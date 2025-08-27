import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../../src/app/page';

describe('Home Page', () => {
  it('should render successfully', () => {
    render(<Page />);
    
    expect(screen.getByText('Home Page')).toBeTruthy();
  });

  it('should render the correct content', () => {
    render(<Page />);
    
    const homePageElement = screen.getByText('Home Page');
    expect(homePageElement).toBeTruthy();
    expect(homePageElement.tagName.toLowerCase()).toBe('div');
  });

  it('should render without errors', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('should be a client component', () => {
    render(<Page />);
    expect(screen.getByText('Home Page')).toBeTruthy();
  });
});
