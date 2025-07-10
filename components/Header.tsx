
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SignOutIcon } from './icons';

interface HeaderProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSignOut: () => void;
    userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onSignOut, userEmail }) => {
    const monthYearFormat = new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
                 <button
                    onClick={onSignOut}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Sign out"
                >
                    <SignOutIcon className="w-6 h-6 text-slate-400" />
                </button>
                {userEmail && <span className="text-sm text-slate-400 hidden sm:block">{userEmail}</span>}
            </div>
            <div className="flex flex-col items-center">
                 <h2 className="text-xl md:text-2xl font-bold text-white">
                    {monthYearFormat.format(currentDate)}
                </h2>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onPrevMonth}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-slate-400" />
                </button>
                <button
                    onClick={onNextMonth}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Next month"
                >
                    <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                </button>
            </div>
        </div>
    );
};

export default Header;
