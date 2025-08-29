'use client';

import { useState } from 'react';
import { Generalmode } from './';

interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
  bedNumber: number;
}

interface GeneralProps {
  onSave: (_data: FormData) => void;
  loading: boolean;
  _onImageSave: (_images: string[]) => void;
  _data: FormData;
}

export const General = ({ onSave, loading, _onImageSave, _data }: GeneralProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: FormData) => {
    onSave(data);
    setIsModalOpen(false);
  };

  const formatValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '-/-';
    }
    return value || '-/-';
  };

  return (
    <div data-cy="General" className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <h2 data-cy="General-Info" className="text-lg font-semibold text-gray-900">
          General Info
        </h2>
        <button data-cy="Edit-General" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium" onClick={handleOpenModal}>
          Edit
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-700">Name:</span>
          <span data-cy="General-Name-Value" className="text-sm text-gray-900">
            {formatValue(_data.name)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <span className="text-sm text-gray-900">{formatValue(_data.type)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-700">Price per night:</span>
          <span className="text-sm text-gray-900">{formatValue(_data.pricePerNight)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-700">Room Information:</span>
          <span className="text-sm text-gray-900">{formatValue(_data.roomInformation)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-700">Bed Number:</span>
          <span className="text-sm text-gray-900">{_data.bedNumber || '-/-'}</span>
        </div>
      </div>

      <Generalmode isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} loading={loading} initialData={_data} />
    </div>
  );
};
