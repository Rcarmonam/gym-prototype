import moment from 'moment';
import { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Render the month and date display for the week
export const renderMonthDateDisplay = (weekDates: Date[]) => {
    const monthDateDisplay = (startDate: Date, endDate: Date) => {
        const startMonth = monthNames[startDate.getMonth()];
        const endMonth = monthNames[endDate.getMonth()];
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} - ${endDay}`;
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        }
    };

    return (
        <p className="monthDateDisplay">{monthDateDisplay(weekDates[0], weekDates[6])}</p>
    );
}

// Format the date to display the day of the week and the day of the month
export const formatDate = (date: Date) => {
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    return `${dayOfWeek}, ${dayOfMonth}`;
};

// Generate an array of dates for the week starting from the given date
export const generateWeekDates = (startWeekDate: Date) => {
    const weekDates = [];
    const sundayDate = moment(startWeekDate).startOf('week');

    for (let i = 0; i < 7; i++) {
        const currentDate = moment(sundayDate).add(i, 'days');
        weekDates.push(currentDate.toDate());
    }
    return weekDates;
};

// Hook to handle the navigation of the week calendar
export const useWeekNavigation = () => {
    const [startWeekDate, setStartWeekDate] = useState(new Date());

    const handleNextWeek = () => {
        const newStartDate = new Date(startWeekDate);
        newStartDate.setDate(newStartDate.getDate() + 7); 
    
        switch (newStartDate.getDay()) {
            case 0: // Sunday
                newStartDate.setDate(newStartDate.getDate());
                break;
            case 1: // Monday
                newStartDate.setDate(newStartDate.getDate() - 1);
                break; 
            case 2: // Tuesday
                newStartDate.setDate(newStartDate.getDate() - 2);
                break;
            case 3: // Wednesday
                newStartDate.setDate(newStartDate.getDate() - 3);
                break;
            case 4: // Thursday
                newStartDate.setDate(newStartDate.getDate() - 4);
                break;
            case 5: // Friday
                newStartDate.setDate(newStartDate.getDate() - 5);
                break;
            case 6: // Saturday
                newStartDate.setDate(newStartDate.getDate() - 6);
                break;
        }
    
        setStartWeekDate(newStartDate);
    };    

    // Handle the navigation to the previous week
    const handlePrevWeek = () => {
        const newStartDate = new Date(startWeekDate);
        
        newStartDate.setDate(newStartDate.getDate() - 7);
    
        switch (newStartDate.getDay()) {
            case 0: // Sunday
                newStartDate.setDate(newStartDate.getDate());
                break;
            case 1: // Monday
                newStartDate.setDate(newStartDate.getDate() - 1);
                break; 
            case 2: // Tuesday
                newStartDate.setDate(newStartDate.getDate() - 2);
                break;
            case 3: // Wednesday
                newStartDate.setDate(newStartDate.getDate() - 3);
                break;
            case 4: // Thursday
                newStartDate.setDate(newStartDate.getDate() - 4);
                break;
            case 5: // Friday
                newStartDate.setDate(newStartDate.getDate() - 5);
                break;
            case 6: // Saturday
                newStartDate.setDate(newStartDate.getDate() - 6);
                break;
        }

        setStartWeekDate(newStartDate); 
    };

    // Return the start date of the week and the navigation handlers
    return { startWeekDate, handleNextWeek, handlePrevWeek };
};