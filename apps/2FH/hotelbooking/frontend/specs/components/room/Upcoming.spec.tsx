import { render } from '@testing-library/react';
import { Upcoming } from '../../../src/components/room/Upcoming';

describe('Upcoming', () => {
  it('should render successfully', () => {
    const { container } = render(<Upcoming />);

    expect(container.textContent).toContain('Upcoming Bookings');
    expect(container.textContent).toContain('No Upcoming Bookings');
  });

  it('should display table headers', () => {
    const { container } = render(<Upcoming />);

    expect(container.textContent).toContain('ID');
    expect(container.textContent).toContain('Guest name');
    expect(container.textContent).toContain('Status');
    expect(container.textContent).toContain('Date');
  });

  it('should display empty state message', () => {
    const { container } = render(<Upcoming />);

    expect(container.textContent).toContain('You currently have no upcoming stays');
  });

  it('should have proper data attributes', () => {
    const { container } = render(<Upcoming />);

    const upcomingElement = container.querySelector('[data-cy="Upcoming"]');
    expect(upcomingElement).toBeDefined();
  });
});
