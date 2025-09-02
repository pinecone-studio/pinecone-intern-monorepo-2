/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { DetailsSection } from '@/components/admin/hotel-detail/edit-sections/DetailsSection';

describe('DetailsSection', () => {
  const mockFormData = {
    description: 'A beautiful hotel in the heart of the city',
    optionalExtras: [
      {
        youNeedToKnow: 'Free breakfast included',
        weShouldMention: '24/7 front desk service',
      },
      {
        youNeedToKnow: 'Pool access available',
        weShouldMention: 'Pool towels provided',
      },
    ],
    languages: ['English', 'Spanish', 'French'],
  };

  const mockHandleInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the component with all sections', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getAllByText('What You Need to Know')).toHaveLength(3); // Main section + 2 items
      expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
    });

    it('renders description textarea with correct value', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const descriptionTextarea = screen.getByPlaceholderText('Enter hotel description...');
      expect(descriptionTextarea).toHaveValue('A beautiful hotel in the heart of the city');
    });

    it('renders optional extras items correctly', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Free breakfast included')).toBeInTheDocument();
      expect(screen.getByDisplayValue('24/7 front desk service')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pool access available')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pool towels provided')).toBeInTheDocument();
    });

    it('renders languages correctly', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByDisplayValue('English')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument();
      expect(screen.getByDisplayValue('French')).toBeInTheDocument();
    });
  });

  describe('Description Section', () => {
    it('calls handleInputChange when description is updated', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const descriptionTextarea = screen.getByPlaceholderText('Enter hotel description...');
      fireEvent.change(descriptionTextarea, { target: { value: 'Updated hotel description' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('description', 'Updated hotel description');
    });
  });

  describe('Optional Extras Section - weShouldMention Textarea', () => {
    it('renders weShouldMention textarea with correct value', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      expect(weShouldMentionTextareas).toHaveLength(2);
      expect(weShouldMentionTextareas[0]).toHaveValue('24/7 front desk service');
      expect(weShouldMentionTextareas[1]).toHaveValue('Pool towels provided');
    });

    it('calls handleInputChange with updated optionalExtras when weShouldMention is changed', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const firstTextarea = weShouldMentionTextareas[0];

      fireEvent.change(firstTextarea, { target: { value: 'Updated additional information' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: 'Updated additional information',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });

    it('calls handleInputChange with updated optionalExtras when weShouldMention is changed for second item', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const secondTextarea = weShouldMentionTextareas[1];

      fireEvent.change(secondTextarea, { target: { value: 'Updated pool information' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: '24/7 front desk service',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Updated pool information',
        },
      ]);
    });

    it('preserves other fields when updating weShouldMention', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const firstTextarea = weShouldMentionTextareas[0];

      fireEvent.change(firstTextarea, { target: { value: 'New additional info' } });

      const expectedCall = mockHandleInputChange.mock.calls[0];
      expect(expectedCall[0]).toBe('optionalExtras');
      expect(expectedCall[1][0].youNeedToKnow).toBe('Free breakfast included');
      expect(expectedCall[1][0].weShouldMention).toBe('New additional info');
      expect(expectedCall[1][1].youNeedToKnow).toBe('Pool access available');
      expect(expectedCall[1][1].weShouldMention).toBe('Pool towels provided');
    });

    it('handles empty weShouldMention value', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const firstTextarea = weShouldMentionTextareas[0];

      fireEvent.change(firstTextarea, { target: { value: '' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: '',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });

    it('handles weShouldMention with special characters', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const firstTextarea = weShouldMentionTextareas[0];

      const specialText = 'Special info with @#$%^&*() characters and "quotes"';
      fireEvent.change(firstTextarea, { target: { value: specialText } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: specialText,
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });
  });

  describe('Optional Extras Section - youNeedToKnow Input', () => {
    it('calls handleInputChange with updated optionalExtras when youNeedToKnow is changed', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter what guests need to know...');
      const firstInput = youNeedToKnowInputs[0];

      fireEvent.change(firstInput, { target: { value: 'Updated need to know info' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Updated need to know info',
          weShouldMention: '24/7 front desk service',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });
  });

  describe('Optional Extras Section - Add/Remove Items', () => {
    it('adds new optional extra item when Add New Item button is clicked', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: '24/7 front desk service',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
        {
          youNeedToKnow: '',
          weShouldMention: '',
        },
      ]);
    });

    it('removes optional extra item when Remove button is clicked', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const removeButtons = screen.getAllByText('Remove');
      const firstRemoveButton = removeButtons[0];
      fireEvent.click(firstRemoveButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });

    it('handles adding item when optionalExtras is empty', () => {
      const formDataWithEmptyExtras = {
        ...mockFormData,
        optionalExtras: [],
      };

      render(<DetailsSection formData={formDataWithEmptyExtras} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: '',
          weShouldMention: '',
        },
      ]);
    });
  });

  describe('Languages Section', () => {
    it('calls handleInputChange when language is updated', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const languageInputs = screen.getAllByPlaceholderText('Enter language...');
      const firstLanguageInput = languageInputs[0];

      fireEvent.change(firstLanguageInput, { target: { value: 'German' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['German', 'Spanish', 'French']);
    });

    it('adds new language when Add Language button is clicked', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const addLanguageButton = screen.getByText('Add Language');
      fireEvent.click(addLanguageButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['English', 'Spanish', 'French', '']);
    });

    it('removes language when Remove button is clicked', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const removeButtons = screen.getAllByText('Remove');
      const firstLanguageRemoveButton = removeButtons[2]; // Third Remove button (after optional extras)
      fireEvent.click(firstLanguageRemoveButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['Spanish', 'French']);
    });
  });

  describe('Edge Cases', () => {
    it('handles formData with null optionalExtras', () => {
      const formDataWithNullExtras = {
        ...mockFormData,
        optionalExtras: null,
      };

      render(<DetailsSection formData={formDataWithNullExtras} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: '',
          weShouldMention: '',
        },
      ]);
    });

    it('handles formData with undefined optionalExtras', () => {
      const formDataWithUndefinedExtras = {
        ...mockFormData,
        optionalExtras: undefined,
      };

      render(<DetailsSection formData={formDataWithUndefinedExtras} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: '',
          weShouldMention: '',
        },
      ]);
    });

    it('handles optionalExtras with null values', () => {
      const formDataWithNullValues = {
        ...mockFormData,
        optionalExtras: [
          {
            youNeedToKnow: null,
            weShouldMention: null,
          },
        ],
      };

      render(<DetailsSection formData={formDataWithNullValues} handleInputChange={mockHandleInputChange} />);

      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      const firstTextarea = weShouldMentionTextareas[0];

      fireEvent.change(firstTextarea, { target: { value: 'New value' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        {
          youNeedToKnow: null,
          weShouldMention: 'New value',
        },
      ]);
    });

    it('handles empty languages array', () => {
      const formDataWithEmptyLanguages = {
        ...mockFormData,
        languages: [],
      };

      render(<DetailsSection formData={formDataWithEmptyLanguages} handleInputChange={mockHandleInputChange} />);

      const addLanguageButton = screen.getByText('Add Language');
      fireEvent.click(addLanguageButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['']);
    });
  });

  describe('Integration Tests', () => {
    it('handles multiple changes to optionalExtras correctly', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      // Change weShouldMention for first item
      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      fireEvent.change(weShouldMentionTextareas[0], { target: { value: 'Updated weShouldMention' } });

      // Change youNeedToKnow for second item
      const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter what guests need to know...');
      fireEvent.change(youNeedToKnowInputs[1], { target: { value: 'Updated youNeedToKnow' } });

      expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
      expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: 'Updated weShouldMention',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
      expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: '24/7 front desk service', // Original value since each call is independent
        },
        {
          youNeedToKnow: 'Updated youNeedToKnow',
          weShouldMention: 'Pool towels provided',
        },
      ]);
    });

    it('handles complex form interactions', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      // Update description
      const descriptionTextarea = screen.getByPlaceholderText('Enter hotel description...');
      fireEvent.change(descriptionTextarea, { target: { value: 'New description' } });

      // Update weShouldMention
      const weShouldMentionTextareas = screen.getAllByPlaceholderText('Enter additional information...');
      fireEvent.change(weShouldMentionTextareas[0], { target: { value: 'New additional info' } });

      // Update language
      const languageInputs = screen.getAllByPlaceholderText('Enter language...');
      fireEvent.change(languageInputs[0], { target: { value: 'German' } });

      expect(mockHandleInputChange).toHaveBeenCalledTimes(3);
      expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'description', 'New description');
      expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'optionalExtras', [
        {
          youNeedToKnow: 'Free breakfast included',
          weShouldMention: 'New additional info',
        },
        {
          youNeedToKnow: 'Pool access available',
          weShouldMention: 'Pool towels provided',
        },
      ]);
      expect(mockHandleInputChange).toHaveBeenNthCalledWith(3, 'languages', ['German', 'Spanish', 'French']);
    });
  });
});
