/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectArtist } from '@/app/(admin)/ticket/_components';
import '@testing-library/jest-dom';
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, 'data-testid': testId, ...props }: any) => (
    <button onClick={onClick} data-testid={testId} {...props}>
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/form', () => ({
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormMessage: () => <div />,
}));
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange?.('artist-1')}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value, 'data-testid': testId }: any) => (
    <div data-testid={testId}>{children}</div>
  ),
  SelectTrigger: ({ children, 'data-testid': testId }: any) => (
    <div data-testid={testId}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));
jest.mock('@mui/material', () => ({
  Stack: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('lucide-react', () => ({
  X: () => <span>×</span>,
}));
describe('SelectArtist', () => {
  const mockArtists = [
    { id: 'artist-1', name: 'Artist One', avatarImage: 'avatar1.jpg' },
    { id: 'artist-2', name: 'Artist Two', avatarImage: 'avatar2.jpg' },
    { id: 'artist-3', name: 'Artist Three', avatarImage: 'avatar3.jpg' },
  ];
  const defaultProps = {
    artists: mockArtists,
    defaultValue: [],
    setValue: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders label and select trigger', () => {
    render(<SelectArtist {...defaultProps} />);
    expect(screen.getByText('артистын нэр*')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByText('артист нэмэх')).toBeInTheDocument();
  });
  it('renders all available artists in select options', () => {
    render(<SelectArtist {...defaultProps} />);
    mockArtists.forEach((artist) => {
      expect(screen.getByTestId(`select-artist-${artist.id}`)).toHaveTextContent(artist.name);
    });
  });
  it('renders selected artists as remove buttons', () => {
    render(<SelectArtist {...defaultProps} defaultValue={['artist-1']} />);
    expect(screen.getByTestId('remove-artist-artist-1')).toHaveTextContent('Artist One');
  });
  it('filters selected artists from dropdown', () => {
    render(<SelectArtist {...defaultProps} defaultValue={['artist-1']} />);
    expect(screen.queryByTestId('select-artist-artist-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('select-artist-artist-2')).toBeInTheDocument();
  });
  it('calls setValue when adding artist', () => {
    const mockSetValue = jest.fn();
    render(<SelectArtist {...defaultProps} setValue={mockSetValue} />);
    fireEvent.click(screen.getByTestId('select'));
    expect(mockSetValue).toHaveBeenCalledWith(['artist-1']);
  });
  it('calls setValue when removing artist', () => {
    const mockSetValue = jest.fn();
    render(
      <SelectArtist 
        {...defaultProps} 
        defaultValue={['artist-1', 'artist-2']} 
        setValue={mockSetValue} 
      />
    );
    fireEvent.click(screen.getByTestId('remove-artist-artist-1'));   
    expect(mockSetValue).toHaveBeenCalledWith(['artist-2']);
  });
  it('handles undefined artists prop', () => {
    render(<SelectArtist {...defaultProps} artists={undefined} />);
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });
  it('handles empty defaultValue array', () => {
    render(<SelectArtist {...defaultProps} defaultValue={[]} />);
    mockArtists.forEach((artist) => {
      expect(screen.getByTestId(`select-artist-${artist.id}`)).toBeInTheDocument();
    });
  });
  it('removes correct artist from multiple selections', () => {
    const mockSetValue = jest.fn();
    render(
      <SelectArtist 
        {...defaultProps} 
        defaultValue={['artist-1', 'artist-2', 'artist-3']} 
        setValue={mockSetValue} 
      />
    );
    fireEvent.click(screen.getByTestId('remove-artist-artist-2'));
    expect(mockSetValue).toHaveBeenCalledWith(['artist-1', 'artist-3']);
  });
   it('does not call setValue when adding duplicate artist', () => {
    const mockSetValue = jest.fn();
    render(<SelectArtist {...defaultProps} defaultValue={['artist-1']} setValue={mockSetValue} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);

    expect(mockSetValue).not.toHaveBeenCalled();
  });
  it('handles removing last selected artist', () => {
    const mockSetValue = jest.fn();
    render(
      <SelectArtist 
        {...defaultProps} 
        defaultValue={['artist-1']} 
        setValue={mockSetValue} 
      />
    );
    fireEvent.click(screen.getByTestId('remove-artist-artist-1'));
    expect(mockSetValue).toHaveBeenCalledWith([]);
  });
});