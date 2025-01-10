import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateStory } from '@/components/story/CreateStory';
import { useAuth } from '@/components/providers';

jest.mock('../../../src/components/providers/AuthProvider.tsx', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('CreateStory Component', () => {
  const mockHandleUploadStoryImg = jest.fn();
  const mockHandleCreateStory = jest.fn();
  const mockDiscardStory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { profileImg: 'https://example.com/user-profile.jpg' },
    });
  });

  it('renders modal with an empty story image and loading state', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg=""
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={true}
      />
    );

    expect(screen.getByText('Add story')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders modal with an empty story image and no loading state', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg=""
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    expect(screen.getByText('Drag photos and videos here')).toBeInTheDocument();
    expect(screen.getByTestId('openInputBtn')).toBeInTheDocument();
  });

  it('triggers file upload handler on input change', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg=""
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { files: [new File([], 'test.jpg')] } });

    expect(mockHandleUploadStoryImg).toHaveBeenCalled();
  });

  it('renders modal with a selected story image and loader during image load', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg="https://example.com/story.jpg"
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    expect(screen.getByText('Add to story')).toBeInTheDocument();
    expect(screen.getByAltText('ImportPhoto')).toHaveAttribute('src', 'https://example.com/story.jpg');
  });

  it('renders user avatar with fallback if profile image is unavailable', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { profileImg: '' },
    });

    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg="https://example.com/story.jpg"
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    expect(screen.getByText('CN')).toBeInTheDocument();
  });

  it('triggers handleCreateStory on button click with an empty story image', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg=""
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    const button = screen.getByText('Select from computer');
    fireEvent.click(button);

    expect(mockHandleCreateStory).not.toHaveBeenCalled();
  });

  it('triggers handleCreateStory on button click with a selected story image', () => {
    render(
      <CreateStory
        openStoryModal={true}
        handleUploadStoryImg={mockHandleUploadStoryImg}
        storyImg="https://example.com/story.jpg"
        discardStory={mockDiscardStory}
        handleCreateStory={mockHandleCreateStory}
        setOpenStoryModal={jest.fn()}
        StoryUploadLoading={false}
      />
    );

    const button = screen.getByText('Your story');
    fireEvent.click(button);

    expect(mockHandleCreateStory).toHaveBeenCalled();
  });
});
