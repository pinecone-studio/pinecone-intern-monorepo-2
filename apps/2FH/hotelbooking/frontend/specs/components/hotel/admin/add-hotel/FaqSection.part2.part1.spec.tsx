import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import type { FaqItem } from '@/components/admin/add-hotel/types';
import { FaqSection } from '@/components/admin/add-hotel/FaqSection';

jest.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="card-title">{children}</div>,
}));

jest.mock('@/components/ui/Input', () => ({
  Input: ({ id, value, onChange, placeholder }: any) => <input id={id} data-testid={`input-${id}`} value={value} onChange={onChange} placeholder={placeholder} />,
}));

jest.mock('@/components/ui/Textarea', () => ({
  Textarea: ({ id, value, onChange, placeholder, rows }: any) => <textarea id={id} data-testid={`textarea-${id}`} value={value} onChange={onChange} placeholder={placeholder} rows={rows} />,
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, _variant, _size, className }: any) => (
    <button data-testid="button" onClick={onClick} type={type} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/Label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: ({ _size }: { size: number }) => <div data-testid="plus-icon">+</div>,
  X: ({ _size }: { size: number }) => <div data-testid="x-icon">×</div>,
  HelpCircle: ({ _size }: { size: number }) => <div data-testid="help-circle-icon">?</div>,
}));

describe('FaqSection.part2 - Part 1', () => {
  const mockFaq: FaqItem[] = [
    { question: 'What is the check-in time?', answer: 'Check-in is at 3 PM.' },
    { question: 'What is the check-out time?', answer: 'Check-out is at 11 AM.' },
  ];

  const mockOnFaqChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles updating multiple fields', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const questionInputs = screen.getAllByPlaceholderText('Enter question...');
    const answerInputs = screen.getAllByPlaceholderText('Enter answer...');

    fireEvent.change(questionInputs[0], { target: { value: 'New question?' } });
    fireEvent.change(answerInputs[1], { target: { value: 'New answer.' } });

    expect(mockOnFaqChange).toHaveBeenCalledTimes(2);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(1, [{ ...mockFaq[0], question: 'New question?' }, mockFaq[1]]);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(2, [
      { ...mockFaq[0], question: 'What is the check-in time?' },
      { ...mockFaq[1], answer: 'New answer.' },
    ]);
  });

  it('handles empty FAQ array', () => {
    render(<FaqSection faq={[]} onFaqChange={mockOnFaqChange} />);

    expect(screen.queryByPlaceholderText('Enter question...')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter answer...')).not.toBeInTheDocument();
    expect(screen.getByText('Add FAQ')).toBeInTheDocument();
  });

  it('handles adding FAQ to empty array', () => {
    render(<FaqSection faq={[]} onFaqChange={mockOnFaqChange} />);

    const addButton = screen.getByText('Add FAQ');
    fireEvent.click(addButton);

    expect(mockOnFaqChange).toHaveBeenCalledWith([{ question: '', answer: '' }]);
  });

  it('has correct input attributes and placeholders', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const questionInputs = screen.getAllByPlaceholderText('Enter question...');
    const answerInputs = screen.getAllByPlaceholderText('Enter answer...');

    expect(questionInputs).toHaveLength(2);
    expect(answerInputs).toHaveLength(2);

    questionInputs.forEach((input) => {
      expect(input).toHaveAttribute('id');
    });

    answerInputs.forEach((textarea) => {
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  it('has correct IDs for form elements', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    expect(screen.getAllByLabelText('Question')[0]).toHaveAttribute('id', 'faq-question-0');
    expect(screen.getAllByLabelText('Answer')[0]).toHaveAttribute('id', 'faq-answer-0');
  });
});
