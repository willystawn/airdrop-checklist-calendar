
import React from 'react';
import { CheckedDates } from '../types';
import { CheckIcon } from './icons';

interface CalendarProps {
    currentDate: Date;
    checkedDates: CheckedDates;
    onDateClick: (date: Date) => void;
}

const formatDateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

const Calendar: React.FC<CalendarProps> = ({ currentDate, checkedDates, onDateClick }) => {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); 

    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const calendarDays: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day));
    }

    const renderDay = (dayDate: Date | null, index: number) => {
        if (!dayDate) {
            return <div key={`empty-${index}`} className="border border-slate-800/50 rounded-lg"></div>;
        }

        const dateKey = formatDateToKey(dayDate);
        const isChecked = !!checkedDates[dateKey];
        const isToday = isSameDay(dayDate, today);

        const dayClasses = [
            'relative', 'flex', 'items-center', 'justify-center',
            'h-16', 'md:h-24', 'border', 'border-slate-800/50',
            'cursor-pointer', 'transition-all', 'duration-200', 'group', 'rounded-lg'
        ];

        if (isChecked) {
            dayClasses.push('bg-emerald-600/80 hover:bg-emerald-600 shadow-lg shadow-emerald-950/50');
        } else {
            dayClasses.push('bg-slate-900/50 hover:bg-slate-700');
        }
        
        const dayNumberClasses = ['text-sm', 'md:text-base', 'flex', 'items-center', 'justify-center', 'w-8', 'h-8', 'rounded-full', 'transition-colors'];

        if (isToday) {
            dayNumberClasses.push('bg-sky-500 font-bold text-white');
        } else {
            dayNumberClasses.push(isChecked ? 'text-emerald-100' : 'text-slate-300');
        }

        return (
            <div
                key={dateKey}
                className={dayClasses.join(' ')}
                onClick={() => onDateClick(dayDate)}
                role="button"
                aria-pressed={isChecked}
                aria-label={`Tanggal ${dayDate.getDate()}`}
            >
                <span className={dayNumberClasses.join(' ')}>{dayDate.getDate()}</span>
                {isChecked && (
                    <div className="absolute bottom-2 right-2 text-emerald-200">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs font-bold text-slate-400">
                {weekDays.map(day => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
                {calendarDays.map(renderDay)}
            </div>
        </div>
    );
};

export default Calendar;
