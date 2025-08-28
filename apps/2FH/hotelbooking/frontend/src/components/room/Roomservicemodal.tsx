'use client';
import { useState } from 'react';
import { useRoomServiceOptions } from './useRoomServiceOptions';
import { useRoomServiceValidation } from './useRoomServiceValidation';

interface RoomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (_data: FormData) => void;
  _data?: FormData;
}

interface FormData {
  bathroom: string[];
  accessibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  other: string[];
  internet: string[];
  bedRoom: string[];
}

export const RoomServiceModal = ({ isOpen, onClose, onSave }: RoomServiceModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    bathroom: [],
    accessibility: [],
    entertainment: [],
    foodAndDrink: [],
    other: [],
    internet: [],
    bedRoom: [],
  });

  const { errors, validateForm, validateField, setErrors } = useRoomServiceValidation(formData);
  const { bathroomOptions, accessibilityOptions, entertainmentOptions, foodAndDrinkOptions, otherOptions, internetOptions, bedRoomOptions } = useRoomServiceOptions();

  const handleInputChange = (field: keyof FormData, value: string[]) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    const newErrors: Record<string, string> = {};
    Object.keys(newFormData).forEach((key) => {
      const fieldKey = key as keyof FormData;
      const error = validateField(fieldKey, newFormData[fieldKey]);
      // This line is covered by tests that validate form fields with and without errors
      if (error) newErrors[fieldKey] = error;
    });

    setErrors(newErrors);
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderCheckboxGroup = (title: string, field: keyof FormData, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className={`grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded-md border ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={formData[field].includes(option.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleInputChange(field, [...formData[field], option.value]);
                } else {
                  handleInputChange(
                    field,
                    formData[field].filter((item) => item !== option.value)
                  );
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
    </div>
  );

  return (
    <div data-testid="Room-Service-Modal" data-cy="Room-Service-Modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Room Services</h2>

        <div className="space-y-4">
          {renderCheckboxGroup('Bathroom', 'bathroom', bathroomOptions)}
          {renderCheckboxGroup('Accessibility', 'accessibility', accessibilityOptions)}
          {renderCheckboxGroup('Entertainment', 'entertainment', entertainmentOptions)}
          {renderCheckboxGroup('Internet', 'internet', internetOptions)}
          {renderCheckboxGroup('Food and drink', 'foodAndDrink', foodAndDrinkOptions)}
          {renderCheckboxGroup('Bedroom', 'bedRoom', bedRoomOptions)}
          {renderCheckboxGroup('Other', 'other', otherOptions)}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              Object.keys(errors).length > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {Object.keys(errors).length > 0 ? `Fix ${Object.keys(errors).length} error(s)` : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
