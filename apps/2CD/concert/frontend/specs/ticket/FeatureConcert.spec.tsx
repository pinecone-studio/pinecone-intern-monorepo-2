/* eslint-disable max-lines */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatureConcert } from '@/app/(admin)/ticket/_components/FeatureConcert';
import '@testing-library/jest-dom';
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange, ...props }: any) => (
    <div data-open={open} onClick={() => onOpenChange?.(!open)} {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
jest.mock('lucide-react', () => ({
  Loader2: ({ className }: any) => (
    <div data-testid="loader2" className={className}>
      Loading...
    </div>
  ),
  Star: ({ size }: any) => (
    <div data-testid="star" data-size={size}>
      ★
    </div>
  ),
}));
describe('FeatureConcert', () => {
  const mockOnClick = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Rendering', () => {
    it('should render the star button initially', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      expect(starButton).toBeInTheDocument();
      expect(screen.getByTestId('star')).toBeInTheDocument();
    });
    it('should render with secondary variant button', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const button = screen.getByTestId('feature-open-concert-dialog');
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });
    it('should render star icon with correct size', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starIcon = screen.getByTestId('star');
      expect(starIcon).toHaveAttribute('data-size', '16');
    });
    it('should render dialog with correct test id', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const dialog = screen.getByTestId('feature-concert-dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-open', 'false');
    });
  });
  describe('Dialog Interaction', () => {
    it('should open dialog when star button is clicked', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const dialog = screen.getByTestId('feature-concert-dialog');
      expect(dialog).toHaveAttribute('data-open', 'true');
    });
    it('should display correct dialog content when opened', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      expect(screen.getByTestId('feature-concert-dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('feature-concert-header')).toBeInTheDocument();
      expect(screen.getByTestId('feature-concert-title')).toHaveTextContent('Онцлох тоглолт болгох');
      expect(screen.getByTestId('feature-concert-footer')).toBeInTheDocument();
      expect(screen.getByTestId('feature-concert-cancel')).toHaveTextContent('болих');
      expect(screen.getByTestId('feature-concert-submit')).toHaveTextContent('Хадгалах');
    });
    it('should close dialog when cancel button is clicked', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const cancelButton = screen.getByTestId('feature-concert-cancel');
      fireEvent.click(cancelButton);
      const dialog = screen.getByTestId('feature-concert-dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
    });
  });
  describe('Feature Concert Action', () => {
    it('should call onClick when save button is clicked', async () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });
    it('should close dialog after successful action when not loading', async () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      fireEvent.click(saveButton);
      await waitFor(() => {
        const dialog = screen.getByTestId('feature-concert-dialog');
        expect(dialog).toHaveAttribute('data-open', 'false');
      });
    });
  });
  describe('Loading State', () => {
    it('should disable save button when loading', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={true} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      expect(saveButton).toBeDisabled();
    });
    it('should show loading spinner when loading', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={true} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      expect(screen.getByTestId('loader2')).toBeInTheDocument();
      expect(screen.getByTestId('loader2')).toHaveClass('animate-spin');
    });
    it('should show save text when not loading', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      expect(saveButton).toHaveTextContent('Хадгалах');
      expect(screen.queryByTestId('loader2')).not.toBeInTheDocument();
    });
    it('should enable save button when not loading', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      expect(saveButton).not.toBeDisabled();
    });
  });
  describe('Async Behavior', () => {
    it('should handle async onClick function', async () => {
      const asyncOnClick = jest.fn().mockResolvedValue(undefined);
      render(<FeatureConcert onClick={asyncOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(asyncOnClick).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('Dialog State Management', () => {
    it('should handle onOpenChange callback', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const dialog = screen.getByTestId('feature-concert-dialog');
      fireEvent.click(dialog);
      expect(dialog).toHaveAttribute('data-open', 'true');
    });
    it('should maintain correct dialog state throughout interaction', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const dialog = screen.getByTestId('feature-concert-dialog');
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
      fireEvent.click(starButton);
      expect(dialog).toHaveAttribute('data-open', 'true');
      const cancelButton = screen.getByTestId('feature-concert-cancel');
      fireEvent.click(cancelButton);
      expect(dialog).toHaveAttribute('data-open', 'false');
    });
  });
  describe('Edge Cases', () => {
    it('should handle multiple rapid clicks on save button', async () => {
      render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      fireEvent.click(saveButton);
      fireEvent.click(saveButton);
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(3);
      });
    });
    it('should handle button clicks while loading', () => {
      render(<FeatureConcert onClick={mockOnClick} loading={true} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      expect(saveButton).toBeDisabled();
      const cancelButton = screen.getByTestId('feature-concert-cancel');
      fireEvent.click(cancelButton);
      const dialog = screen.getByTestId('feature-concert-dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
    });
    it('should handle component re-renders with different loading states', () => {
      const { rerender } = render(<FeatureConcert onClick={mockOnClick} loading={false} />);
      const starButton = screen.getByTestId('feature-open-concert-dialog');
      fireEvent.click(starButton);
      const saveButton = screen.getByTestId('feature-concert-submit');
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Хадгалах');
      rerender(<FeatureConcert onClick={mockOnClick} loading={true} />);
      expect(saveButton).toBeDisabled();
      expect(screen.getByTestId('loader2')).toBeInTheDocument();
      rerender(<FeatureConcert onClick={mockOnClick} loading={false} />);
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Хадгалах');
      expect(screen.queryByTestId('loader2')).not.toBeInTheDocument();
    });
  });
});
