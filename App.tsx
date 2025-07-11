import React, { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import Calendar from './components/Calendar';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Auth } from './components/Auth';
import { Counter } from './components/Counter';
import { CheckedDates } from './types';
import { supabase } from './supabase/client';

const formatDateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [checkedDates, setCheckedDates] = useState<CheckedDates>({});
    const [confirmingDate, setConfirmingDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            fetchCheckedDates(session.user.id);
        } else {
            setIsLoading(false);
        }
    }, [session]);

    const fetchCheckedDates = async (userId: string) => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('checked_dates')
            .select('date')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching checked dates:', error);
            let detailedError = `Gagal memuat data: ${error.message}`;
            if (error.message.toLowerCase().includes('rls') || error.message.includes('security policy')) {
                detailedError = 'Gagal memuat data. Kemungkinan besar ini karena Row Level Security (RLS) di database Anda.\n\nPastikan Anda telah membuat kebijakan (policy) di tabel "checked_dates" yang mengizinkan pengguna untuk MEMBACA (SELECT) data mereka sendiri.';
            }
            alert(detailedError);
        } else if (data) {
            const dates: CheckedDates = data.reduce((acc, item) => {
                if (item.date) {
                  acc[item.date] = true;
                }
                return acc;
            }, {} as CheckedDates);
            setCheckedDates(dates);
        }
        setIsLoading(false);
    };

    const handlePrevMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const handleNextMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const handleDateClick = useCallback(async (date: Date) => {
        if (!session) return;
        const dateKey = formatDateToKey(date);
        const isChecked = !!checkedDates[dateKey];

        if (isChecked) {
            setConfirmingDate(date);
        } else {
            setCheckedDates(prev => ({ ...prev, [dateKey]: true }));

            const { error } = await supabase.from('checked_dates').insert({ date: dateKey, user_id: session.user.id });

            if (error) {
                console.error("Error checking date:", error);
                let detailedError = `Gagal menyimpan centang: ${error.message}`;
                if (error.message.toLowerCase().includes('rls') || error.message.includes('security policy')) {
                    detailedError = 'Gagal menyimpan data. Kemungkinan besar ini karena Row Level Security (RLS) di database Anda.\n\nPastikan Anda telah membuat kebijakan (policy) di tabel "checked_dates" yang mengizinkan pengguna untuk MEMBUAT (INSERT) data mereka sendiri.';
                }
                alert(detailedError);
                setCheckedDates(prev => {
                    const newDates = { ...prev };
                    delete newDates[dateKey];
                    return newDates;
                });
            }
        }
    }, [checkedDates, session]);

    const handleConfirmUncheck = useCallback(async () => {
        if (!confirmingDate || !session) return;
        const dateKey = formatDateToKey(confirmingDate);
        
        const originalState: CheckedDates = { ...checkedDates };
        
        setCheckedDates(prev => {
            const newDates = { ...prev };
            delete newDates[dateKey];
            return newDates;
        });
        setConfirmingDate(null);

        const { error } = await supabase.from('checked_dates').delete().match({ date: dateKey, user_id: session.user.id });
        
        if (error) {
            console.error("Error unchecking date:", error);
            let detailedError = `Gagal menghapus centang: ${error.message}`;
             if (error.message.toLowerCase().includes('rls') || error.message.includes('security policy')) {
                detailedError = 'Gagal menghapus data. Kemungkinan besar ini karena Row Level Security (RLS) di database Anda.\n\nPastikan Anda telah membuat kebijakan (policy) di tabel "checked_dates" yang mengizinkan pengguna untuk MENGHAPUS (DELETE) data mereka sendiri.';
            }
            alert(detailedError);
            setCheckedDates(originalState);
        }
    }, [confirmingDate, checkedDates, session]);
    
    const handleCloseDialog = useCallback(() => {
        setConfirmingDate(null);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setCheckedDates({}); // Clear local data on sign out
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-400">Menyinkronkan data...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <>
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
                <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
                            Checklist Kalender
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-md mx-auto">
                            Tandai setiap tanggal untuk memastikan semua tugas postingan telah selesai.
                        </p>
                    </div>
                    <div className="bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 p-1 md:p-2">
                         <Header 
                            currentDate={currentDate}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            onSignOut={handleSignOut}
                            userEmail={session.user.email}
                        />
                        <Calendar
                            currentDate={currentDate}
                            checkedDates={checkedDates}
                            onDateClick={handleDateClick}
                        />
                    </div>
                    <Counter />
                     <footer className="text-center mt-8 text-slate-500 text-sm">
                        <p>Progres Anda disinkronkan dengan akun Anda.</p>
                    </footer>
                </div>
            </div>
            <ConfirmDialog
                isOpen={!!confirmingDate}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmUncheck}
                title="KAMU YAKIN?!"
                confirmText="IYA, MAU BUANG-BUANG WAKTU!"
                cancelText="Maaf. Gak Jadi."
            >
                <p>
                    Kenapa dibatalkan lagi?! Bukannya airdrop di tanggal ini sudah jelas-jelas ditandai SELESAI? 
                    <br/><br/>
                    Kalau sudah dicentang itu artinya <strong className="text-white font-bold">DONE CHECK!</strong> Gak perlu dicek ulang, buang-buang waktu njir!!
                </p>
            </ConfirmDialog>
        </>
    );
};

export default App;