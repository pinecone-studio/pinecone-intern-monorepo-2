import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AddHotelGeneralInfo from '@/components/AddHotelGeneralInfo';

describe('AddHotelGeneralInfo Component', () => {
  it('renders the form and validates errors', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <AddHotelGeneralInfo open={true} setOpen={jest.fn()} />
      </MockedProvider>
    );

    expect(getByTestId('General-Info-Form')).toBeInTheDocument();

    fireEvent.click(getByTestId('Save-Button'));

    await waitFor(() => {
      expect(getByTestId('Hotel-Name-Error')).toBeInTheDocument();
      expect(getByTestId('Hotel-Stars-Rating')).toBeInTheDocument();
      expect(getByTestId('Review-Rating')).toBeInTheDocument();
    });
  });
});
