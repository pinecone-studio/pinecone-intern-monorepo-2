import Loading from '@/app/(public)/hotel-detail/Loading';
import { render } from '@testing-library/react';

describe('Loading test', () => {
  it('it should render', () => {
    render(<Loading />);
  });
});
