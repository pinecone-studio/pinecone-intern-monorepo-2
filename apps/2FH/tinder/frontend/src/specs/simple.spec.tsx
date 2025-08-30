import React from 'react';
import { render, screen } from '@testing-library/react';

const SimpleComponent = () => <div>Hello World</div>;

describe('Simple Test', () => {
  it('renders hello world', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
