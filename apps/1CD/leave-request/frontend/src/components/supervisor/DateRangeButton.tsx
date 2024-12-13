'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MdOutlineDateRange } from 'react-icons/md';

const DateRangeButton: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate > endDate) {
      setError('Дуусах хугацаа эхлэх хугацаанаас хойш байх ёстой');
    } else {
      setError('');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (startDate && newEndDate < startDate) {
      setError('Дуусах хугацаа эхлэх хугацаанаас хойш байх ёстой');
    } else {
      setError('');
    }
  };

  const formattedRange = startDate && endDate ? `${format(new Date(startDate), 'dd MMMM yyyy')} - ${format(new Date(endDate), 'dd MMMM yyyy')}` : 'Select Date Range';

  const closeModal = () => {
    setShowInputs(false);
  };

  const openModal = () => {
    setShowInputs(true);
  };

  return (
    <div>
      <div
        onClick={openModal}
        style={{
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'white',
        }}
        className="text-sm px-4 py-2 h-10 border-[1px] border-[#E4E4E7]"
      >
        <MdOutlineDateRange />
        <span style={{ marginLeft: '8px' }} className="text-sm">
          {formattedRange}
        </span>
      </div>

      {/* Modal */}
      {showInputs && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Огноогоо сонгоно уу</h2>
            <div className="mt-4">
              <label>
                Эхлэх огноо:
                <input type="date" value={startDate} onChange={handleStartDateChange} className="ml-2" />
              </label>
            </div>
            <div>
              <label>
                Дуусах огноо:
                <input type="date" value={endDate} onChange={handleEndDateChange} className="ml-2" />
              </label>
            </div>

            {error && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                <strong>{error}</strong>
              </div>
            )}

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeButton;
