import AddHotelGeneralInfo from '@/components/AddHotelGeneralInfo';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { AddHotelGeneralInfoDocument } from '@/generated';

const mock: MockedResponse = {
  request: {
    query: AddHotelGeneralInfoDocument,
  },
  result: {
    data: {
      _id: '1',
      hotelName: 'test',
      description: 'tes1234',
      starRating: 5,
      userRating: 10,
      phoneNumber: 8042810,
    },
  },
};
const mockAddHotelGeneralInfo = jest.fn();
jest.mock('@/generated', () => ({
  useAddHotelGeneralInfoMutation: () => [mockAddHotelGeneralInfo],
}));
describe('add hotel general info ', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <AddHotelGeneralInfo open={true} setOpen={jest.fn()} />
      </MockedProvider>
    );
    const saveButton = getByTestId('Save-Button');
    fireEvent.click(saveButton);
    // const hotelNameInput = getByTestId('Hotel-Name-Input');
    await waitFor(() => {
      expect(getByTestId('General-Info-Form'));
      expect(getByTestId('Hotel-Name-Error'));
      expect(getByTestId('Review-Rating'));
      expect(getByTestId('Hotel-Stars-Rating'));
    });

    // fireEvent.change(hotelNameInput, { target: { value: 'hotel' } });
  });
  it('all form is filled', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <AddHotelGeneralInfo open={true} setOpen={jest.fn()} />
      </MockedProvider>
    );

    fireEvent.change(getByTestId('Hotel-Name-Input'), { target: { value: 'Hotel A' } });
    fireEvent.change(getByTestId('StarsRating'), { target: { value: 5 } });
    fireEvent.change(getByTestId('Phonenumber'), { target: { value: '12345678' } });
    fireEvent.change(getByTestId('Review-Rating'), { target: { value: 4 } });
    fireEvent.click(getByTestId('Save-Button'));
    await waitFor(() => {
      expect(mockAddHotelGeneralInfo).toHaveBeenCalledWith({
        variables: {
          input: {
            hotelName: 'Hotel A',
            description: '',
            starRating: 5,
            userRating: 4,
            phoneNumber: 12345678,
          },
        },
      });
    });
  });
});
