"use client";

import { useState } from "react";
import { markAsPaid } from "../_actions";

const METHODS = [
  { value: "wave",          label: "Wave" },
  { value: "orange_money",  label: "Orange Money" },
  { value: "free_money",    label: "Free Money" },
  { value: "virement",      label: "Virement bancaire" },
  { value: "especes",       label: "Espèces" },
  { value: "autre",         label: "Autre" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white";

export default function MarkAsPaidButton({ id }: { id: string }) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState(false);
  const [method, setMethod]   = useState("wave");
  const [reference, setRef]   = useState("");
  const [phone, setPhone]     = useState("");

  async function handleConfirm() {
    setPending(true);
    await markAsPaid(id, {
      method,
      reference: reference.trim() || undefined,
      phone:     phone.trim()     || undefined,
    });
    setOpen(false);
    setPending(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Confirmer le paiement"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Marquer payé
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Confirmer le paiement</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Mode de paiement */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mode de paiement <span className="text-red-400">*</span>
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className={inputClass}
                >
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Référence transaction */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Référence / N° transaction
                  <span className="text-slate-400 font-normal text-xs ml-1">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="ex : WV-2024-XXXXXXX"
                  className={inputClass}
                />
              </div>

              {/* Téléphone payeur */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Téléphone du payeur
                  <span className="text-slate-400 font-normal text-xs ml-1">(optionnel)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ex : +221 77 000 00 00"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirm}
                disabled={pending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {pending ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Confirmer le paiement
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={pending}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
