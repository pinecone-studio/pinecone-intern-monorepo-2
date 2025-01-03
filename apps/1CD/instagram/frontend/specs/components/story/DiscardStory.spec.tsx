import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiscardStory } from '@/components/story/DiscardStory';

describe('DiscardStory Component', () => {
  const mockDiscardStory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog trigger button', () => {
    render(<DiscardStory discardStory={mockDiscardStory} />);

    // Check that the trigger button is present
    const triggerButton = screen.getByRole('button', { name: /go back/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens the dialog when the trigger button is clicked', () => {
    render(<DiscardStory discardStory={mockDiscardStory} />);

    // Open the dialog
    const triggerButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(triggerButton);

    // Check that the dialog content is displayed
    expect(screen.getByText('Discard Story?')).toBeInTheDocument();
    expect(screen.getByText('If you go back now, you will lose any changes you have made.')).toBeInTheDocument();
  });

  it('calls discardStory when the Discard button is clicked', () => {
    render(<DiscardStory discardStory={mockDiscardStory} />);

    // Open the dialog
    const triggerButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(triggerButton);

    // Click the discard button
    const discardButton = screen.getByRole('button', { name: /discard/i });
    fireEvent.click(discardButton);

    // Verify that discardStory was called
    expect(mockDiscardStory).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when Keep editing is clicked', () => {
    render(<DiscardStory discardStory={mockDiscardStory} />);

    // Open the dialog
    const triggerButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(triggerButton);

    // Click the "Keep editing" button
    const keepEditingButton = screen.getByRole('button', { name: /keep editing/i });
    fireEvent.click(keepEditingButton);

    // Check that the dialog content is no longer displayed
    expect(screen.queryByText('Discard Story?')).not.toBeInTheDocument();
  });
});
