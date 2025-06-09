'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export const DateRangeSelector =()=> {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <input type="text" readOnly value={range.startDate.toLocaleDateString()} onClick={() => setShowCalendar(true)} className="border rounded p-2 mr-2" placeholder="Start Date" />
      <input type="text" readOnly value={range.endDate.toLocaleDateString()} className="border rounded p-2" placeholder="End Date" />

      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white shadow rounded">
          <DateRange
            editableDateInputs={true}
            onChange={(item: RangeKeyDict) => {
              const selection = item.selection;
              setRange({
                startDate: selection.startDate ?? new Date(),
                endDate: selection.endDate ?? new Date(),
                key: selection.key ?? 'selection',
              });
            }}
            moveRangeOnFirstSelection={false}
            ranges={[range]}
            months={2}
            direction="horizontal"
          />
          <button onClick={() => setShowCalendar(false)} className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
