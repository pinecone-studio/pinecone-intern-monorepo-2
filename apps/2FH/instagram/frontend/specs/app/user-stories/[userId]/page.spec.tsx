// specs/app/user-stories/[userId]/page.spec.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserStory from '@/app/(sidebargui)/user-stories/[userId]/page';
import { useGetStoryByUserIdQuery } from '@/generated';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

jest.mock('@/generated', () => ({
  useGetStoryByUserIdQuery: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ userId: '1' }),
}));

const mockStories = [
  { _id: '1', image: '/story1.jpg', author: { userName: 'Alice', profileImage: '/alice.jpg' } },
  { _id: '2', image: '/story2.jpg', author: { userName: 'Alice', profileImage: '/alice.jpg' } },
];

describe('UserStory', () => {
  beforeEach(() => {
    (useGetStoryByUserIdQuery as jest.Mock).mockReturnValue({
      data: { getStoryByUserId: mockStories },
      loading: false,
      error: null,
    });
    jest.useFakeTimers();
    mockPush.mockClear();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders first story', async () => {
    render(<UserStory />);
    const story = await screen.findByAltText('story');
    expect(story).toHaveAttribute('src', '/story1.jpg');
  });

  it('navigates to next story when clicking right zone', async () => {
    render(<UserStory />);
    const rightZone = screen.getByTestId('next-zone');

    fireEvent.click(rightZone);

    const story = await screen.findByAltText('story');
    expect(story).toHaveAttribute('src', '/story2.jpg');
  });

  it('goes back to previous story when clicking left zone', async () => {
    render(<UserStory />);
    const rightZone = screen.getByTestId('next-zone');
    const leftZone = screen.getByTestId('prev-zone');

    fireEvent.click(rightZone);
    fireEvent.click(leftZone);

    const story = await screen.findByAltText('story');
    expect(story).toHaveAttribute('src', '/story1.jpg');
  });

  it('auto advances story after progress reaches 100%', async () => {
    render(<UserStory />);

    await act(async () => {
      jest.advanceTimersByTime(5100); // progress 100% хүртэл
      await Promise.resolve(); // flush state update
    });

    const story = await screen.findByAltText('story');
    expect(story).toHaveAttribute('src', '/story2.jpg');
  });

  it('pushes to home after last story', () => {
    render(<UserStory />);

    const nextZone = screen.getByTestId('next-zone');

    fireEvent.click(nextZone);

    fireEvent.click(nextZone);

    expect(mockPush).toHaveBeenCalledWith('/userProfile');
  });
});
