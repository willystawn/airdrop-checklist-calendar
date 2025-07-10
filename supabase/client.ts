import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// Mengambil kredensial Supabase dari environment variables.
// Pastikan variabel ini sudah dikonfigurasi di environment Anda.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    const rootEl = document.getElementById('root');
    if (rootEl) {
        rootEl.innerHTML = `
        <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100">
            <div class="bg-slate-800 p-8 rounded-lg shadow-2xl text-center max-w-md border border-red-500/50">
                <h1 class="text-2xl font-bold text-red-400 mb-4">Konfigurasi Supabase Diperlukan</h1>
                <p class="text-slate-300">
                    Kredensial Supabase (URL dan Kunci Anon) tidak ditemukan di environment variables.
                </p>
                <p class="text-slate-400 mt-4 text-sm">
                    Pastikan Anda telah mengatur variabel <code>SUPABASE_URL</code> dan <code>SUPABASE_ANON_KEY</code> di lingkungan Anda.
                </p>
            </div>
        </div>
        `;
    }
    throw new Error("Supabase URL and anon key are not configured in environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
