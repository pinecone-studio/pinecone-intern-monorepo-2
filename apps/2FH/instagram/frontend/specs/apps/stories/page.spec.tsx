import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Stories from '../../../src/app/(sidebargui)/stories/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

/// In your test file (specs/apps/stories/page.spec.tsx), add this at the top:

/* eslint-disable no-secrets/no-secrets */

// Mock the story images to match what your tests expect
jest.mock('@/components/stories/story-images', () => ({
  avatar: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1748945750/ywtnohcefiy112efkhwx.png',
  avatar2: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1749022363/ihpednn9gnmebe4ozmxq.png',
  avatar3: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1748511161/gcu8ntx1c5bkfqlfwxnw.png',
  avatar4: 'https://res.cloudinary.com/demo/image/upload/flower.jpg',
  avatar5: 'https://res.cloudinary.com/demo/image/upload/car.jpg',
  storyImage: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1751008273/pain_oxdu59.jpg',
  storyImage2: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1751271874/gb1v6olhagsfsogubl8r.jpg',
  storyImage3: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1756273400/6ebc08ad-b1bc-4494-b30b-f38d6fe7ea46_qvtvtc.jpg',
  storyImage4: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1756273720/8465a285-6a40-4758-a452-79da14da0a51_bcuemm.jpg',
  storyImage5: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1756273720/8465a285-6a40-4758-a452-79da14da0a51_bcuemm.jpg',
  storyImage6: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1756273725/6ef2eee3-d315-4c20-b8df-144c13a46ebb_g9d8lj.jpg',
  storyImage7: 'https://res.cloudinary.com/dqd01lbfy/image/upload/v1756287282/9fdab73b-1694-4d7e-a28f-1be1bfacfe25_drajge.jpg',
}));

/* eslint-enable no-secrets/no-secrets */

describe('Stories Component', () => {
  let pushMock: jest.Mock;

  const getStoryNavigationAreas = () => {
    // Find the main story container (the one with w-[521px])
    const mainContainer = document.querySelector('.w-\\[521px\\]');
    if (!mainContainer) return { leftArea: null, rightArea: null };

    // Find the invisible clickable divs within it
    const clickableAreas = mainContainer.querySelectorAll('.absolute.cursor-pointer[class*="w-1/2"]');

    // The left area has "left-0" class, right area has "right-0" class
    const leftArea = Array.from(clickableAreas).find((el) => el.classList.contains('left-0'));
    const rightArea = Array.from(clickableAreas).find((el) => el.classList.contains('right-0'));

    return { leftArea, rightArea };
  };

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('renders Instagram header', () => {
    render(<Stories />);
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  test('clicking right half goes to next story', async () => {
    render(<Stories />);

    const { rightArea } = getStoryNavigationAreas();
    expect(rightArea).toBeTruthy();
    fireEvent.click(rightArea);

    await waitFor(() => {
      const img = screen.getByTestId('main-story-image');
      expect(img).toHaveAttribute('src', expect.stringContaining('gb1v6olhagsfsogubl8r.jpg'));
    });
  });

  test('clicking left half goes to previous story', async () => {
    render(<Stories />);

    // First go to next story
    const { rightArea } = getStoryNavigationAreas();
    expect(rightArea).toBeTruthy();
    fireEvent.click(rightArea);

    // Then go back to previous story
    const { leftArea } = getStoryNavigationAreas();
    expect(leftArea).toBeTruthy();
    fireEvent.click(leftArea);

    await waitFor(() => {
      const img = screen.getByTestId('main-story-image');
      expect(img).toHaveAttribute('src', expect.stringContaining('pain_oxdu59.jpg'));
    });
  });

  test('auto progresses to next story after duration', async () => {
    render(<Stories />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      const img = screen.getByTestId('main-story-image');
      expect(img).toHaveAttribute('src', expect.stringContaining('gb1v6olhagsfsogubl8r.jpg'));
    });
  });

  test('last user should redirect to /stories', () => {
    render(<Stories />);
    for (let i = 0; i < 10; i++) {
      act(() => {
        jest.advanceTimersByTime(6000);
      });
    }
    expect(pushMock).toHaveBeenCalledWith('/stories');
  });
});
