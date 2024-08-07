// components/MyCalendar.tsx

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../redux/todoSlice';
import { RootState, AppDispatch } from '../redux/store';


interface CalendarProps {
  onDateChange: (date: Date) => void; // Add onDateChange prop
}

const MyCalendar: React.FC<CalendarProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedDate = useSelector((state: RootState) => state.todos.selectedDate);
  const [value, setValue] = useState<Date>(selectedDate ? new Date(selectedDate) : new Date());

  const handleDateChange = (date: Date | Date[]) => {
    // Ensure date is a single Date object
    const selected = Array.isArray(date) ? date[0] : date;

    // Convert selected date to UTC (ISO format)
    const utcDateString = new Date(Date.UTC(selected.getFullYear(), selected.getMonth(), selected.getDate()))
      .toISOString()
      .split('T')[0]; // 'YYYY-MM-DD' format
    localStorage.setItem('selectedDate', utcDateString);
    dispatch(setSelectedDate(utcDateString));
  };

  useEffect(() => {
    if (selectedDate) {
      setValue(new Date(selectedDate));
    }
  }, [selectedDate]);

  // Format the selected date for display
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(selectedDate))
    : 'Select a date';

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <div className="mb-4 text-center">
        <div className="inline-block p-3 bg-black rounded-xl text-white">
          <h2 className="text-xl">{formattedDate}</h2>
        </div>
      </div>
      <Calendar onChange={handleDateChange} value={value} />
    </div>
  );
};

export default MyCalendar;
