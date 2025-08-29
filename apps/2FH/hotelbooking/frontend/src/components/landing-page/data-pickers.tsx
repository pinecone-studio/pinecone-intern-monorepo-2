"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";

export type DatePickerProps = {
  onDateChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
};

export default function DatePicker({ onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const nextMonth = addMonths(currentMonth, 1);
  
  const handleDateClick = (date: Date) => {
    if (!selectedDates.startDate || (selectedDates.startDate && selectedDates.endDate)) {
      // Start new selection
      setSelectedDates({ startDate: date, endDate: null });
    } else {
      // Complete selection
      const startDate = selectedDates.startDate;
      if (date < startDate) {
        setSelectedDates({ startDate: date, endDate: startDate });
      } else {
        setSelectedDates({ startDate, endDate: date });
      }
    }
  };

  const handleConfirm = () => {
    onDateChange(selectedDates);
    setIsOpen(false);
  };

  const formatDisplayText = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      return `${format(selectedDates.startDate, 'MMMM d')} - ${format(selectedDates.endDate, 'MMMM d')}`;
    } else if (selectedDates.startDate) {
      return format(selectedDates.startDate, 'MMMM d');
    }
    return "Select dates";
  };

  const renderCalendar = (month: Date) => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-64">
        <div className="text-center font-semibold text-gray-900 mb-3">
          {format(month, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, month);
            const isSelected = selectedDates.startDate && isSameDay(day, selectedDates.startDate);
            const isInRange = selectedDates.startDate && selectedDates.endDate && 
              day > selectedDates.startDate && day < selectedDates.endDate;
            const isEndDate = selectedDates.endDate && isSameDay(day, selectedDates.endDate);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  w-8 h-8 rounded-full text-sm font-medium transition-colors
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900 hover:bg-gray-100'}
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${isInRange ? 'bg-blue-100 text-blue-900' : ''}
                  ${isEndDate ? 'bg-blue-600 text-white' : ''}
                  ${isToday(day) ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full h-12 justify-between text-black bg-white border-gray-300 hover:bg-gray-50 rounded-xl pl-10">
          <span className="truncate text-left font-medium">{formatDisplayText()}</span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-xl border-0" align="start">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dates</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-6">
            {renderCalendar(currentMonth)}
            {renderCalendar(nextMonth)}
          </div>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-xl font-medium"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 
