import DisplayTugrug from '@/components/DisplayTugrug';
import { render } from '@testing-library/react';

describe('DisplayTugrug component test', () => {
  it('it should render', () => {
    render(<DisplayTugrug tugrug={5000} />);
  });
  it('it should render with undefined', () => {
    render(<DisplayTugrug tugrug={undefined} />);
  });
});
