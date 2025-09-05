import { DatePicker } from '@/components/date/Date';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAuthProvider } from '@/components/providers/UserAuthProvider';
import { MockedProvider } from '@apollo/client/testing';
import * as UserAuthProviderModule from '@/components/providers/UserAuthProvider';

const mockUseOtpContext = jest.spyOn(UserAuthProviderModule, 'useOtpContext');
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
describe('DatePicker', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
  it('should render the date picker', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('guest-button'));
    expect(screen.getByTestId('adult-count')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('adult-plus-button'));
    expect(screen.getByTestId('adult-count')).toHaveTextContent('2');
  });

  it('should push to the correct url when search button is clicked', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );

    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    expect(mockPush).toHaveBeenCalledWith('/search');
  });

  it('should decrement adult count when minus button is clicked', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('guest-button'));

    const count = screen.getByTestId('adult-count');
    const minusBtn = screen.getByTestId('adult-minus-button');

    expect(count.textContent).toBe('1');

    fireEvent.click(minusBtn);
    expect(count.textContent).toBe('0');

    fireEvent.click(minusBtn);
    expect(count.textContent).toBe('0');
  });

  it('should increment children count when plus button is clicked', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('guest-button'));

    const count = screen.getByTestId('children-count');
    const plusBtn = screen.getByTestId('children-plus-button');

    expect(count.textContent).toBe('0');

    fireEvent.click(plusBtn);
    expect(count.textContent).toBe('1');
  });

  it('should decrement children count when minus button is clicked', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTestId('guest-button'));

    const count = screen.getByTestId('children-count');
    const minusBtn = screen.getByTestId('children-minus-button');

    expect(count.textContent).toBe('0');

    fireEvent.click(minusBtn);
    expect(count.textContent).toBe('0');

    fireEvent.click(minusBtn);
    expect(count.textContent).toBe('0');
  });

  it('should close the guest dropdown when done button is clicked', () => {
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );

    fireEvent.click(screen.getByTestId('guest-button'));

    const doneBtn = screen.getByTestId('done-button');
    fireEvent.click(doneBtn);

    expect(screen.queryByTestId('modal-dropdown')).not.toBeInTheDocument();
  });

  it('should show only from date when to date is not set', () => {
    mockUseOtpContext.mockReturnValue({
      range: { from: new Date(2025, 8, 5), to: undefined },
    } as any);

    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );
    expect(screen.getByText('September 05')).toBeInTheDocument();
  });

  it('should show "Pick a date range" when no range is set', () => {
    mockUseOtpContext.mockReturnValue({
      range: undefined,
    } as any);
    render(
      <MockedProvider>
        <UserAuthProvider>
          <DatePicker />
        </UserAuthProvider>
      </MockedProvider>
    );
    expect(screen.getByText('Pick a date range')).toBeInTheDocument();
  });
});
