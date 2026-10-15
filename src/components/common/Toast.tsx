import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 bg-white ${
              isSuccess
                ? 'border-emerald-200 text-slate-800'
                : isError
                ? 'border-rose-200 text-slate-800'
                : 'border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-600 shrink-0" />}
              <span className="text-sm font-medium leading-tight text-slate-800">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md shrink-0 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
