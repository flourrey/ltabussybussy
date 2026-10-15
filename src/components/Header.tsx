import React from 'react';
import { Bus, Bell, Server, RefreshCw, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: 'arrivals' | 'map' | 'routes' | 'nearby' | 'saved';
  setActiveTab: (tab: 'arrivals' | 'map' | 'routes' | 'nearby' | 'saved') => void;
  onOpenAlerts: () => void;
  onOpenBackendModal: () => void;
  activeAlertCount: number;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  singaporeTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAlerts,
  onOpenBackendModal,
  activeAlertCount,
  isRefreshing,
  onManualRefresh,
  singaporeTime
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <Bus className="w-5 h-5" />
            </div>
            <button
              onClick={() => setActiveTab('arrivals')}
              className="text-left cursor-pointer group"
            >
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SG <span className="text-emerald-400">BusLive</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
                Singapore Real-Time Transit
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (4-5 single-line items) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold ${
                activeTab === 'arrivals'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Bus Arrivals
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold ${
                activeTab === 'map'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Live Bus Map
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold ${
                activeTab === 'routes'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Route Tracker
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold ${
                activeTab === 'nearby'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Nearby Stops
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs font-semibold flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved Commutes
            </button>
          </nav>

          {/* Zone 3: Primary Action & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* SGT Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-300 font-mono tabular-nums">
              <span className="text-slate-400">SGT</span>
              <span className="text-emerald-400 font-semibold">{singaporeTime}</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={onManualRefresh}
              title="Refresh timings"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Alerts button */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
              title="Bus Arrival Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {activeAlertCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenBackendModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Backend API</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
