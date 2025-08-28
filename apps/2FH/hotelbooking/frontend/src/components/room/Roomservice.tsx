'use client';

import { useState } from 'react';
import { RoomServiceModal } from './Roomservicemodal';

interface RoomserviceProps {
  onSave: (_data: ServiceData) => void;
  loading: boolean;
  _data?: ServiceData;
}

interface ServiceData {
  bathroom: string[];
  accessibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  other: string[];
  internet: string[];
  bedRoom: string[];
}

export const Roomservice = ({ onSave, _data }: RoomserviceProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>(
    _data || {
      bathroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      other: [],
      internet: [],
      bedRoom: [],
    }
  );

  const handleSave = (data: ServiceData) => {
    setServiceData(data);
    onSave(data);
    setIsModalOpen(false);
  };

  const formatServiceData = (data: string[]) => {
    if (data.length === 0) return '-/-';
    return data
      .map((item) =>
        item
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase())
      )
      .join(', ');
  };

  // Use _data if available, otherwise use local state
  const displayData = _data || serviceData;

  return (
    <div data-cy="Roomservice" className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <h2 data-cy="Room-Service" className="text-lg font-semibold text-gray-900">
          Room Services
        </h2>
        <button data-cy="Edit-Room-Service" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span data-cy="Bathroom" className="text-sm font-medium text-gray-700">
              Bathroom:
            </span>
            <span data-cy="Bathroom-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.bathroom)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span data-cy="Entertainment" className="text-sm font-medium text-gray-700">
              Entertainment:
            </span>
            <span data-cy="Entertainment-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.entertainment)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">Food and drink:</span>
            <span data-cy="Food-and-Drink-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.foodAndDrink)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span data-cy="Other" className="text-sm font-medium text-gray-700">
              Other:
            </span>
            <span data-cy="Other-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.other)}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span data-cy="Accessibility" className="text-sm font-medium text-gray-700">
              Accessibility:
            </span>
            <span data-cy="Accessibility-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.accessibility)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span data-cy="Internet" className="text-sm font-medium text-gray-700">
              Internet:
            </span>
            <span data-cy="Internet-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.internet)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span data-cy="Bedroom" className="text-sm font-medium text-gray-700">
              Bedroom:
            </span>
            <span data-cy="Bedroom-Value" className="text-sm text-gray-900">
              {formatServiceData(displayData.bedRoom)}
            </span>
          </div>
        </div>
      </div>

      <RoomServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
};
