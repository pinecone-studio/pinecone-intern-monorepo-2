'use client';

import { useState } from 'react';

interface FormData {
  bathroom: string[];
  accessibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  other: string[];
  internet: string[];
  bedRoom: string[];
}

export const useRoomServiceValidation = (formData: FormData) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof FormData, value: string[]): string => {
    if (value.length === 0) {
      const fieldNames: Record<string, string> = {
        bathroom: 'bathroom service',
        accessibility: 'accessibility option',
        entertainment: 'entertainment option',
        foodAndDrink: 'food and drink option',
        internet: 'internet option',
        bedRoom: 'bedroom option',
        other: 'other option',
      };
      return `Please select at least one ${fieldNames[field]}`;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((field) => {
      const key = field as keyof FormData;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    setErrors,
    validateForm,
    validateField,
  };
};
