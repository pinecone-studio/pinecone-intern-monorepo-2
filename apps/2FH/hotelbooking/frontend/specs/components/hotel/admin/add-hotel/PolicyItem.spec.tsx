import { render, screen, fireEvent } from '@/TestUtils';
import PolicyItem from '../../../../../src/components/admin/add-hotel/PolicyItem';
import { Policy } from '../../../../../src/components/admin/add-hotel/types';

const mockPolicy: Policy = {
  checkIn: '14:00',
  checkOut: '11:00',
  specialCheckInInstructions: 'Please present valid ID at check-in',
  accessMethods: ['Key card', 'Mobile app'],
  childrenAndExtraBeds: 'Children under 12 stay free',
  pets: 'Pets not allowed',
};

describe('PolicyItem', () => {
  it('renders policy information correctly', () => {
    render(<PolicyItem policy={mockPolicy} />);

    expect(screen.getByText('Hotel Policy')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
    expect(screen.getByText('Please present valid ID at check-in')).toBeInTheDocument();
    expect(screen.getByText('Children under 12 stay free')).toBeInTheDocument();
    expect(screen.getByText('Pets not allowed')).toBeInTheDocument();
  });

  it('renders access methods as badges', () => {
    render(<PolicyItem policy={mockPolicy} />);

    expect(screen.getByText('Key card')).toBeInTheDocument();
    expect(screen.getByText('Mobile app')).toBeInTheDocument();
  });

  it('renders edit and delete buttons when callbacks are provided', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(<PolicyItem policy={mockPolicy} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render edit and delete buttons when callbacks are not provided', () => {
    render(<PolicyItem policy={mockPolicy} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(<PolicyItem policy={mockPolicy} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(mockOnEdit).toHaveBeenCalledWith(mockPolicy);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(<PolicyItem policy={mockPolicy} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('Delete'));

    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('renders with correct styling classes', () => {
    render(<PolicyItem policy={mockPolicy} />);

    // The main container should have the border classes
    const mainContainer = screen.getByText('Hotel Policy').parentElement?.parentElement;
    expect(mainContainer).toHaveClass('border', 'rounded-lg', 'p-4', 'mb-4');
  });

  it('handles empty access methods array', () => {
    const policyWithNoAccessMethods = {
      ...mockPolicy,
      accessMethods: [],
    };

    render(<PolicyItem policy={policyWithNoAccessMethods} />);

    expect(screen.getByText('Access Methods:')).toBeInTheDocument();
    // Should not crash when there are no access methods to display
  });

  it('handles single access method', () => {
    const policyWithSingleAccessMethod = {
      ...mockPolicy,
      accessMethods: ['Key card only'],
    };

    render(<PolicyItem policy={policyWithSingleAccessMethod} />);

    expect(screen.getByText('Key card only')).toBeInTheDocument();
  });
});
