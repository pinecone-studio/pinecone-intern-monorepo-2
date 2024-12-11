import CardTicket from '@/components/Card';
import { render } from '@testing-library/react';
import { Event } from '@/generated';

const event = {
  _id: '1',
  name: 'Rockit bay',
};

describe('Card', () => {
  it('should render', async () => {
    render(<CardTicket event={event as Event} />);
  });
});
