import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { FaqSection } from '@/components/admin/add-hotel/FaqSection';

const mockFaq = [
  {
    question: 'What is the check-in time?',
    answer: 'Check-in time is 3:00 PM.',
  },
  {
    question: 'Do you have free WiFi?',
    answer: 'Yes, we provide free WiFi throughout the hotel.',
  },
];

const mockOnFaqChange = jest.fn();

describe('FaqSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and icon', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all existing FAQ items', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    expect(screen.getByDisplayValue('What is the check-in time?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Check-in time is 3:00 PM.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Do you have free WiFi?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Yes, we provide free WiFi throughout the hotel.')).toBeInTheDocument();
  });

  it('displays FAQ numbers correctly', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    expect(screen.getByText('FAQ 1')).toBeInTheDocument();
    expect(screen.getByText('FAQ 2')).toBeInTheDocument();
  });

  it('displays add FAQ button', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    expect(screen.getByText('Add FAQ')).toBeInTheDocument();
  });

  it('handles adding a new FAQ', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const addButton = screen.getByText('Add FAQ');
    fireEvent.click(addButton);

    expect(mockOnFaqChange).toHaveBeenCalledWith([...mockFaq, { question: '', answer: '' }]);
  });

  it('handles removing a FAQ', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(2); // Should have 2 remove buttons for 2 FAQs

    fireEvent.click(removeButtons[0]); // Remove first FAQ

    expect(mockOnFaqChange).toHaveBeenCalledWith([mockFaq[1]]);
  });

  it('handles updating a question', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const questionInputs = screen.getAllByPlaceholderText('Enter question...');
    fireEvent.change(questionInputs[1], { target: { value: 'Updated question?' } });

    expect(mockOnFaqChange).toHaveBeenCalledWith([mockFaq[0], { ...mockFaq[1], question: 'Updated question?' }]);
  });

  it('handles updating an answer', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const answerInputs = screen.getAllByPlaceholderText('Enter answer...');
    fireEvent.change(answerInputs[0], { target: { value: 'Updated answer.' } });

    expect(mockOnFaqChange).toHaveBeenCalledWith([{ ...mockFaq[0], answer: 'Updated answer.' }, mockFaq[1]]);
  });

  it('does not show remove button when only one FAQ exists', () => {
    render(<FaqSection faq={[mockFaq[0]]} onFaqChange={mockOnFaqChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(0);
  });

  it('handles multiple FAQ additions', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const addButton = screen.getByText('Add FAQ');

    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(mockOnFaqChange).toHaveBeenCalledTimes(2);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(1, [...mockFaq, { question: '', answer: '' }]);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(2, [...mockFaq, { question: '', answer: '' }]);
  });

  it('handles removing multiple FAQs', () => {
    render(<FaqSection faq={mockFaq} onFaqChange={mockOnFaqChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    fireEvent.click(removeButtons[0]); // Remove first
    fireEvent.click(removeButtons[0]); // Remove second (now first after first removal)

    expect(mockOnFaqChange).toHaveBeenCalledTimes(2);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(1, [mockFaq[1]]);
    expect(mockOnFaqChange).toHaveBeenNthCalledWith(2, [mockFaq[1]]);
  });
});
