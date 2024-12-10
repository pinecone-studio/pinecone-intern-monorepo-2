import BookingImportantInformation from '@/components/BookingImportantInformation';
import { render } from '@testing-library/react';

describe('WhoCheckingText', () => {
  it('it should be render', () => {
    render(<BookingImportantInformation />);
  });
});
