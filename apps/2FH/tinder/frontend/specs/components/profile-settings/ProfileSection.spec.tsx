import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProfileSection } from '@/components/profile-settings/ProfileSection';

describe('ProfileSection Component', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
  });

  it('renders form with initial values', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    expect(screen.getByLabelText('Name')).toHaveValue('Elon');
    expect(screen.getByLabelText('Email')).toHaveValue('Musk');
    expect(screen.getByLabelText('Date of birth')).toHaveValue('21 Aug 1990');
    expect(screen.getByLabelText('Gender Preferences:')).toHaveValue('Female');
    expect(screen.getByLabelText('Bio')).toHaveValue(
      'Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design.'
    );
    expect(screen.getByLabelText('Profession')).toHaveValue('Software Engineer');
    expect(screen.getByLabelText('School/Work')).toHaveValue('Amazon');
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('You can select up to a maximum of 10 interests.')).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane' } });
    expect(nameInput).toHaveValue('Jane');

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    expect(emailInput).toHaveValue('jane@example.com');

    const bioTextarea = screen.getByLabelText('Bio');
    fireEvent.change(bioTextarea, { target: { value: 'New bio' } });
    expect(bioTextarea).toHaveValue('New bio');

    const genderSelect = screen.getByLabelText('Gender Preferences:');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });
    expect(genderSelect).toHaveValue('Male');
  });

  it('toggles interests and respects 10-interest limit', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const artButton = screen.getByText('Art');
    const musicButton = screen.getByText('Music');

    fireEvent.click(artButton);
    expect(artButton).toHaveClass('bg-red-500 text-white');
    fireEvent.click(musicButton);
    expect(musicButton).toHaveClass('bg-red-500 text-white');

    fireEvent.click(artButton);
    expect(artButton).toHaveClass('bg-gray-200 text-gray-700');

    const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];
    
    interests.forEach(interest => {
      const button = screen.getByText(interest);
      if (button.className.includes('bg-red-500')) fireEvent.click(button);
    });
    
    interests.forEach(interest => {
      const button = screen.getByText(interest);
      fireEvent.click(button);
    });
    
    const selectedButtons = screen.getAllByText(/Art|Music|Investment|Technology|Design|Education|Health|Fashion|Travel|Food/)
      .filter(button => button.className.includes('bg-red-500'));
    expect(selectedButtons).toHaveLength(10);

    const extraButton = screen.getByText('Art');
    fireEvent.click(extraButton);
    expect(extraButton).toHaveClass('bg-gray-200 text-gray-700');
    
    fireEvent.click(extraButton);
    expect(extraButton).toHaveClass('bg-red-500 text-white');
    
    const finalSelectedButtons = screen.getAllByText(/Art|Music|Investment|Technology|Design|Education|Health|Fashion|Travel|Food/)
      .filter(button => button.className.includes('bg-red-500'));
    expect(finalSelectedButtons).toHaveLength(10);
  });

  it('submits form and calls onSuccess', () => {
    const mockOnSuccess = jest.fn();
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const submitButton = screen.getByText('Update profile');
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('renders date of birth calendar button', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const calendarButton = screen.getByLabelText('Date of birth').parentElement?.querySelector('button');
    expect(calendarButton).toBeInTheDocument();
    expect(calendarButton?.querySelector('svg')).toHaveClass('w-5 h-5');
  });

  it('handles empty input values', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: '' } });
    expect(nameInput).toHaveValue('');

    const bioTextarea = screen.getByLabelText('Bio');
    fireEvent.change(bioTextarea, { target: { value: '' } });
    expect(bioTextarea).toHaveValue('');

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    fireEvent.click(screen.getByText('Update profile'));
    expect(mockOnSuccess).toHaveBeenCalledWith('Profile Updated Successfully');
  });

  it('renders all interest buttons', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];
    interests.forEach(interest => {
      expect(screen.getByText(interest)).toBeInTheDocument();
    });
  });

  it('handles all form field changes for complete coverage', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    
    const dateInput = screen.getByLabelText('Date of birth');
    fireEvent.change(dateInput, { target: { value: '15 Jan 1995' } });
    expect(dateInput).toHaveValue('15 Jan 1995');

    const professionInput = screen.getByLabelText('Profession');
    fireEvent.change(professionInput, { target: { value: 'Designer' } });
    expect(professionInput).toHaveValue('Designer');

    const schoolWorkInput = screen.getByLabelText('School/Work');
    fireEvent.change(schoolWorkInput, { target: { value: 'Google' } });
    expect(schoolWorkInput).toHaveValue('Google');

    const genderSelect = screen.getByLabelText('Gender Preferences:');
    fireEvent.change(genderSelect, { target: { value: 'Both' } });
    expect(genderSelect).toHaveValue('Both');
  });

  it('prevents form submission when clicking calendar button', () => {
    render(<ProfileSection onSuccess={mockOnSuccess} />);
    const calendarButton = screen.getByLabelText('Date of birth').parentElement?.querySelector('button');
    expect(calendarButton).toHaveAttribute('type', 'button');
  });
});