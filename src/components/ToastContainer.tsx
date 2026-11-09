import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const iconMap: Record<ToastMessage['type'], React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-campus-400 shrink-0" />,
  };

  const borderMap: Record<ToastMessage['type'], string> = {
    success: 'border-emerald-500/30 bg-emerald-950/20',
    warning: 'border-amber-500/30 bg-amber-950/20',
    error: 'border-red-500/30 bg-red-950/20',
    info: 'border-campus-500/30 bg-campus-950/20',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-xl border bg-white/95 dark:bg-charcoal-850/95 text-gray-800 dark:text-gray-100 transition-all duration-300 animate-in slide-in-from-bottom-5 ${borderMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold leading-tight tracking-wide font-['Plus_Jakarta_Sans']">
              {toast.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 -mr-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

