import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { FaqSection } from '@/components/admin/add-hotel/FaqSection';
import type { FaqItem } from '@/components/admin/add-hotel/types';

jest.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="card-title">{children}</div>,
}));

jest.mock('@/components/ui/Input', () => ({
  Input: ({ id, value, onChange, placeholder }: any) => <input data-testid={`input-${id}`} value={value} onChange={onChange} placeholder={placeholder} />,
}));

jest.mock('@/components/ui/Textarea', () => ({
  Textarea: ({ id, value, onChange, placeholder, rows }: any) => <textarea data-testid={`textarea-${id}`} value={value} onChange={onChange} placeholder={placeholder} rows={rows} />,
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, _variant, _size, className }: any) => (
    <button data-testid="button" onClick={onClick} type={type} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/Label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => <label data-testid={`label-${htmlFor}`}>{children}</label>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: ({ _size }: { size: number }) => <div data-testid="plus-icon">+</div>,
  X: ({ _size }: { size: number }) => <div data-testid="x-icon">×</div>,
  HelpCircle: ({ _size }: { size: number }) => <div data-testid="help-circle-icon">?</div>,
}));

describe('FaqSection - Part 2', () => {
  const mockFaq: FaqItem[] = [
    { question: 'What is the check-in time?', answer: 'Check-in is at 3 PM.' },
    { question: 'What is the check-out time?', answer: 'Check-out is at 11 AM.' },
  ];
  const mockOnFaqChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FaqSection.part2 - Part 2', () => {
    it('maintains FAQ order when updating', () => {
      render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

      const questionInputs = screen.getAllByPlaceholderText('Enter question...');
      fireEvent.change(questionInputs[1], { target: { value: 'Updated second question?' } });

      expect(mockOnFaqChange).toHaveBeenCalledWith([mockFaq[0], { ...mockFaq[1], question: 'Updated second question?' }]);
    });

    it('handles special characters in questions and answers', () => {
      render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

      const questionInputs = screen.getAllByPlaceholderText('Enter question...');
      const answerInputs = screen.getAllByPlaceholderText('Enter answer...');

      fireEvent.change(questionInputs[0], { target: { value: "What's the WiFi password? (Free?)" } });
      fireEvent.change(answerInputs[0], { target: { value: 'Password: "Hotel123" - Free for guests!' } });

      expect(mockOnFaqChange).toHaveBeenCalledTimes(2);
      expect(mockOnFaqChange).toHaveBeenNthCalledWith(1, [{ ...mockFaq[0], question: "What's the WiFi password? (Free?)" }, mockFaq[1]]);
      expect(mockOnFaqChange).toHaveBeenNthCalledWith(2, [{ ...mockFaq[0], question: 'What is the check-in time?', answer: 'Password: "Hotel123" - Free for guests!' }, mockFaq[1]]);
    });

    it('handles very long questions and answers', () => {
      render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

      const questionInputs = screen.getAllByPlaceholderText('Enter question...');
      const answerInputs = screen.getAllByPlaceholderText('Enter answer...');

      const longQuestion = 'A'.repeat(200);
      const longAnswer = 'B'.repeat(500);

      fireEvent.change(questionInputs[0], { target: { value: longQuestion } });
      fireEvent.change(answerInputs[0], { target: { value: longAnswer } });

      expect(mockOnFaqChange).toHaveBeenCalledTimes(2);
      expect(mockOnFaqChange).toHaveBeenNthCalledWith(1, [{ ...mockFaq[0], question: longQuestion }, mockFaq[1]]);
      expect(mockOnFaqChange).toHaveBeenNthCalledWith(2, [{ ...mockFaq[0], question: 'What is the check-in time?', answer: longAnswer }, mockFaq[1]]);
    });

    it('handles rapid add/remove operations', () => {
      render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

      const addButton = screen.getByText('Add FAQ');
      const removeButtons = screen.getAllByTestId('button').filter((button) => button.textContent.includes('×'));

      // Rapid operations
      fireEvent.click(addButton);
      fireEvent.click(removeButtons[0]);
      fireEvent.click(addButton);

      expect(mockOnFaqChange).toHaveBeenCalledTimes(3);
    });

    it('renders FAQ items in bordered containers', () => {
      render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

      const faqContainers = screen.getAllByText(/FAQ \d+/).map((text) => text.closest('.border'));
      expect(faqContainers[0]).toHaveClass('border', 'rounded-lg', 'p-4');
    });
  });
});
