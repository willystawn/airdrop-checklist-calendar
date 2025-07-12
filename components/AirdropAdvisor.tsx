import React, { useState } from 'react';
import { XMarkIcon } from './icons';

interface AirdropAdvisorProps {
    isOpen: boolean;
    onClose: () => void;
}

// Updated ToggleSwitch to notify parent of changes via onToggle callback
const ToggleSwitch = ({ id, label, tag, onToggle }: { id: string, label: string, tag?: string, onToggle?: (isChecked: boolean) => void }) => {
    const [checked, setChecked] = useState(false);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = e.target.checked;
        setChecked(newCheckedState);
        onToggle?.(newCheckedState);
    };

    return (
        <label htmlFor={id} className="flex items-center justify-between cursor-pointer p-3 bg-slate-900 rounded-lg hover:bg-slate-700/80 transition-colors">
            <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-2">
                <span className="text-slate-300">{label}</span>
                {tag && (
                    <span className="mt-1 sm:mt-0 text-xs font-semibold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                )}
            </div>
            <div className="relative flex-shrink-0">
                <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={handleToggle} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
            </div>
        </label>
    );
};

const AirdropAdvisor: React.FC<AirdropAdvisorProps> = ({ isOpen, onClose }) => {
    const [isPointsSystem, setIsPointsSystem] = useState(false);
    const [isOgRole, setIsOgRole] = useState(false);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative mx-4 w-full max-w-md transform-gpu rounded-2xl bg-slate-800/95 border border-slate-700 text-slate-100 shadow-2xl shadow-emerald-950/50 transition-all p-6 animate-scale-in"
            >
                 <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label="Close"
                 >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500" id="modal-title">
                        Checklist Strategi Airdrop
                    </h2>
                     <p className="text-slate-400 text-sm mt-1">Gunakan daftar ini untuk merencanakan setiap airdrop.</p>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch id="bot-allowed" label="Bisa pakai bot auto tx?" tag="@NeedBot / @BotDone" />
                    <ToggleSwitch id="multi-account" label="Multi akun?" tag="@Tuyul" />
                    
                    {/* Points System with conditional child */}
                    <div>
                        <ToggleSwitch id="points-system" label="Sistem poin?" tag="@Points" onToggle={setIsPointsSystem} />
                        {isPointsSystem && (
                            <div className="mt-3 pl-6 ml-4 border-l-2 border-slate-700 animate-scale-in">
                                <ToggleSwitch id="points-no-limit" label="Poin no limit?" tag="@NoLimits" />
                            </div>
                        )}
                    </div>
                    
                    {/* OG Role with conditional child */}
                    <div>
                         <ToggleSwitch id="og-role" label="Role OG?" onToggle={setIsOgRole} />
                         {isOgRole && (
                             <div className="mt-3 pl-6 ml-4 border-l-2 border-slate-700 animate-scale-in">
                                <ToggleSwitch id="discord-push" label="Perlu push DC?" tag="@OGPushDC" />
                             </div>
                         )}
                    </div>
                                     
                    <div className="pt-2">
                        <label htmlFor="strategy-notes" className="block text-sm font-medium text-slate-300 mb-2">
                            Bagaimana cara biar dapat banyak? (Catatan Strategi)
                        </label>
                        <textarea
                            id="strategy-notes"
                            placeholder="Tuliskan strategi, link penting, atau catatan lain di sini..."
                            rows={4}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirdropAdvisor;