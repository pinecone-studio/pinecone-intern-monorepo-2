import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchList } from '@/app/message/_components/MatchList';
import '@testing-library/jest-dom';

describe('MatchList', () => {
  const mockOnSelect = jest.fn();

  const mockMatches = [
    {
      _id: 'match1',
      users: [
        { _id: 'user1', name: 'Alice' },
        { _id: 'user2', name: 'Bob' },
      ],
    },
    {
      _id: 'match2',
      users: [
        { _id: 'user3', name: 'Charlie' },
        { _id: 'user4', name: 'Dana' },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders match list with all matches and user names', () => {
    render(
      <MatchList
        matches={mockMatches}
        selectedMatchId={null}
        onSelect={mockOnSelect}
      />
    );

    // Match container
    expect(screen.getByTestId('match-list')).toBeInTheDocument();

    // Match items
    const matchItems = screen.getAllByTestId('match-item');
    expect(matchItems).toHaveLength(mockMatches.length);

    // User names
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Dana')).toBeInTheDocument();
  });

  it('calls onSelect with correct match ID when a match is clicked', () => {
    render(
      <MatchList
        matches={mockMatches}
        selectedMatchId={null}
        onSelect={mockOnSelect}
      />
    );

    const matchItems = screen.getAllByTestId('match-item');
    fireEvent.click(matchItems[1]);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('match2');
  });

  it('highlights selected match with correct class', () => {
    render(
      <MatchList
        matches={mockMatches}
        selectedMatchId="match1"
        onSelect={mockOnSelect}
      />
    );

    const matchItems = screen.getAllByTestId('match-item');

    expect(matchItems[0]).toHaveClass('bg-blue-100');
    expect(matchItems[0]).toHaveClass('border-blue-400');

    expect(matchItems[1]).not.toHaveClass('bg-blue-100');
    expect(matchItems[1]).not.toHaveClass('border-blue-400');
  });
});
