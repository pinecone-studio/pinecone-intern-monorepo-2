import FollowerDialog from '@/components/user-profile/FollowerDialog';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
const mockedFollowerData = [{ _id: '1', fullName: 'Mock User1', profileImg: 'http://www.example.com/proImage1.jpg', userName: 'MockiU' }];
describe('render followers dialog', () => {
  it('1. should render successfully', async () => {
    render(<FollowerDialog followerData={mockedFollowerData} followerDataCount={1} />);
  });
  it('2. should show followers dialog when click in followers', async () => {
    render(<FollowerDialog followerData={mockedFollowerData} followerDataCount={1} />);
    const trigger = screen.getByTestId('followerNumber');
    fireEvent.click(trigger);
    expect(screen.getByTestId('followerDialog')).toBeDefined();
  });

  it('3. close the dialog when close button is clicked', async () => {
    render(<FollowerDialog followerData={mockedFollowerData} followerDataCount={1} />);
    const trigger = screen.getByTestId('followerNumber');
    fireEvent.click(trigger);
    const closeButton = screen.getByTestId('closeButton');
    fireEvent.click(closeButton);
    expect(screen.getByTestId('followerDialog')).not.toBeDefined();
  });
});
