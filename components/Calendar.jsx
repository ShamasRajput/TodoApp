import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = () => {
    const [value, setValue] = useState(new Date());

    return (
        <div className="p-4 bg-white rounded-2xl shadow-lg">
            <Calendar onChange={setValue} value={value} />
        </div>
    );
};

export default MyCalendar;

