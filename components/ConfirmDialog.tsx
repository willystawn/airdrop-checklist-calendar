import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmText?: string; // Teks untuk tombol konfirmasi
    cancelText?: string;  // Teks untuk tombol batal
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    children,
    confirmText = "Ya, Lanjutkan Saja!", // Default text yang lebih ngegas
    cancelText = "Oke, Aku Pikir Ulang"  // Default text yang lebih penurut
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="relative mx-4 w-full max-w-md transform-gpu rounded-2xl bg-slate-800/95 border border-slate-700 text-slate-100 shadow-2xl shadow-red-950/50 transition-all p-6 text-center animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src="https://i.pinimg.com/originals/08/03/58/08035897f5dfbf24add1a88aeeedb5ae.gif"
                    alt="Are you sure?!"
                    className="mx-auto mb-4 rounded-full w-28 h-28 object-cover border-4 border-red-500/50"
                />
                
                {/* JUDUL DIBUAT LEBIH GALAK */}
                <h3 className="text-xl font-bold text-red-400 uppercase tracking-wider mb-2" id="modal-title">
                    {title}
                </h3>
                
                {/* TEKS ISI DIBUAT LEBIH JELAS */}
                <div className="text-slate-300 mb-6 px-4">
                    {children}
                </div>
                
                <div className="flex flex-col sm:flex-row-reverse gap-3">
                     <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all sm:w-auto"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-slate-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors sm:mt-0 sm:w-auto"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};
