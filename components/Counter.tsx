import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PlusIcon, MinusIcon, ArrowPathIcon } from './icons';

export const Counter: React.FC = () => {
    const [count, setCount] = useLocalStorage('taskCounter', 0);

    const increment = () => setCount(c => c + 1);
    const decrement = () => setCount(c => Math.max(0, c - 1));
    const reset = () => setCount(0);

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 p-4 md:p-6 text-center animate-scale-in">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Penghitung Tugas</h3>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={decrement}
                        disabled={count === 0}
                        className="p-3 rounded-full bg-slate-700/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Kurangi hitungan"
                    >
                        <MinusIcon className="w-6 h-6 text-slate-300" />
                    </button>

                    <span className="text-5xl md:text-6xl font-bold text-white w-28 tabular-nums">
                        {count}
                    </span>

                    <button
                        onClick={increment}
                        className="p-3 rounded-full bg-emerald-600/80 hover:bg-emerald-600 transition-colors"
                        aria-label="Tambah hitungan"
                    >
                        <PlusIcon className="w-6 h-6 text-white" />
                    </button>
                </div>
                <div className="mt-5">
                     <button
                        onClick={reset}
                        disabled={count === 0}
                        className="px-4 py-2 text-sm rounded-md bg-slate-600 text-slate-200 hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
                        aria-label="Atur ulang hitungan"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Atur Ulang</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
