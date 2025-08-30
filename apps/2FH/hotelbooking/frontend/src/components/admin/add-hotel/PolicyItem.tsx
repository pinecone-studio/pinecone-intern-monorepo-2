import React from 'react';
import { Policy } from './types';

interface PolicyItemProps {
  policy: Policy; // eslint-disable-line no-unused-vars
  onEdit?: (policy: Policy) => void; // eslint-disable-line no-unused-vars
  onDelete?: () => void; // eslint-disable-line no-unused-vars
}

export const PolicyItem: React.FC<PolicyItemProps> = ({ policy, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">Hotel Policy</h4>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(policy)} className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Check-in:</span>
          <span className="ml-2 text-gray-900">{policy.checkIn}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Check-out:</span>
          <span className="ml-2 text-gray-900">{policy.checkOut}</span>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-700">Special Instructions:</span>
          <p className="mt-1 text-gray-900">{policy.specialCheckInInstructions}</p>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-700">Access Methods:</span>
          <div className="mt-1">
            {policy.accessMethods.map((method, index) => (
              <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1 text-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-700">Children & Extra Beds:</span>
          <p className="mt-1 text-gray-900">{policy.childrenAndExtraBeds}</p>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-700">Pets Policy:</span>
          <p className="mt-1 text-gray-900">{policy.pets}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyItem;
