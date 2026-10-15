import React from 'react';
import { CommuterAlert } from '../types/transit';
import {
  Bell,
  X,
  Volume2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface CommuterAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: CommuterAlert[];
  onRemoveAlert: (id: string) => void;
  onTestChime: () => void;
}

export const CommuterAlertModal: React.FC<CommuterAlertModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onRemoveAlert,
  onTestChime
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Commuter Arrival Alerts</h3>
              <p className="text-xs text-slate-400">
                Audio chime & notification alerts when your bus approaches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Audio test & banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Synthesized web chime active (works offline)</span>
            </div>
            <button
              onClick={onTestChime}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Test Sound
            </button>
          </div>

          {/* Active alerts list */}
          <div className="space-y-2.5">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No active arrival alerts</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tap &ldquo;Set Alert&rdquo; on any bus card to get notified when your bus is 2 minutes away.
                </p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    alert.triggered
                      ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                      : 'bg-slate-800/80 border-slate-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center font-mono font-bold text-base text-white">
                      {alert.serviceNo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Stop {alert.stopCode}
                        </span>
                        {alert.triggered ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 animate-pulse">
                            BUS ARRIVING NOW
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            Monitoring ({alert.targetMins}m alert)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[240px]">
                        {alert.stopDescription}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveAlert(alert.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
