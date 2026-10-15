import React from 'react';
import { BusStop, BusArrivalService } from '../types/transit';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBusData';
import { getBusArrivalsForStop } from '../services/busSimulationService';
import {
  Bookmark,
  MapPin,
  Trash2,
  ChevronRight,
  Briefcase,
  Home,
  Star,
  Clock,
  Plus
} from 'lucide-react';

interface SavedCommutesViewProps {
  savedStopCodes: string[];
  onToggleSaveStop: (stopCode: string) => void;
  onSelectStop: (stop: BusStop) => void;
  elapsedSeconds: number;
}

export const SavedCommutesView: React.FC<SavedCommutesViewProps> = ({
  savedStopCodes,
  onToggleSaveStop,
  onSelectStop,
  elapsedSeconds
}) => {
  const savedStops = SINGAPORE_BUS_STOPS.filter(s => savedStopCodes.includes(s.code));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Personal Transit Hub
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Saved Bus Stops & Commute Shortcuts
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              One-tap live arrival glance for your daily work, home, and transit routes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {savedStops.length} stops saved
            </span>
          </div>
        </div>
      </div>

      {/* Saved Stops Cards */}
      {savedStops.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No saved bus stops yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Bookmark your most frequent bus stops (like City Hall, Dhoby Ghaut, or Orchard) by
            tapping the bookmark icon on any bus stop card.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['04111', '08057', '09022', '03511'].map(code => {
              const stop = SINGAPORE_BUS_STOPS.find(s => s.code === code);
              if (!stop) return null;
              return (
                <button
                  key={code}
                  onClick={() => onToggleSaveStop(code)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add {stop.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savedStops.map(stop => {
            const arrivals = getBusArrivalsForStop(stop.code, elapsedSeconds);

            return (
              <div
                key={stop.code}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all"
              >
                {/* Stop Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelectStop(stop)}
                    className="flex items-center gap-3 cursor-pointer group flex-1"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md">
                      {stop.code}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {stop.description}
                      </h4>
                      <p className="text-xs text-slate-400">{stop.roadName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSaveStop(stop.code)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Live Arrivals Strip */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                    <span>Live Arrivals:</span>
                    <button
                      onClick={() => onSelectStop(stop)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 normal-case font-bold"
                    >
                      <span>Full Board</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {arrivals.slice(0, 3).map(service => {
                      const sec = service.nextBus?.estimatedSeconds;
                      const text = sec === undefined ? '-' : (sec <= 10 ? 'Arr' : `${Math.floor(sec / 60)}m`);
                      return (
                        <div
                          key={service.serviceNo}
                          className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                        >
                          <span className="font-mono font-extrabold text-xs text-emerald-400">
                            {service.serviceNo}
                          </span>
                          <span
                            className={`font-mono text-xs font-bold ${
                              text === 'Arr' ? 'text-emerald-400 animate-pulse' : 'text-slate-200'
                            }`}
                          >
                            {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
