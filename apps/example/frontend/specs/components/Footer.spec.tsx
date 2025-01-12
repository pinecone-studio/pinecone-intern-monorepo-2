import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Footer } from '../../src/components';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<Footer />);
  });
});
