import { RoomInformationSvg } from '@/components/payment/_components/assets/RoomInformationSvg';
import { render } from '@testing-library/react';

describe('Room information SVG', () => {
  it('1. should render room information svg', async () => {
    const { getByTestId } = render(<RoomInformationSvg />);
    const container = getByTestId('Room-Information-Svg');
    expect(container);
  });
});
