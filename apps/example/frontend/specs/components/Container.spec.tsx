import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Container } from '../../src/components';

describe('Container', () => {
  it('should render successfully', async () => {
    render(<Container />);
  });
});
