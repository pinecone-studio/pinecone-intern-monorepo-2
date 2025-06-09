import { UpdateCancelReqModal } from '@/app/(admin)/request/_components/UpdateCancelReqModal';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('update cancel request modal', () => {
  it('should render update-req-modal', () => {
    render(<UpdateCancelReqModal name="Tim" onclick={() => jest.fn()} />);
    expect(screen.getByTestId('update-req-modal')).toHaveTextContent('дуусгах');
  });
});
