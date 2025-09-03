import { render } from '@testing-library/react';
import { RoomInformation } from '@/components/payment/_components/RoomInformation';

describe('Should render Room information component', () => {
  it('1. Should render Room information component', async () => {
    const { getByTestId } = render(<RoomInformation />);
    const container = getByTestId('Room-Information-Container');
    expect(container);
  });
});
