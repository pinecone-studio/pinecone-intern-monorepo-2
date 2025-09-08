import { NoImage } from '@/components/payment/_components/assets/NoImage';
import { render } from '@testing-library/react';

describe('Should Render No Image Svg Component', () => {
  it('1. Should render No Image Component', async () => {
    const { getByTestId } = render(<NoImage />);
    const containerDiv = getByTestId('No-Image-Component');
    expect(containerDiv);
  });
});
