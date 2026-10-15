import React from 'react';
import {
  BusArrivalService,
  NextBus,
  LoadLevel,
  BusType
} from '../types/transit';
import {
  Accessibility,
  Bell,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface BusArrivalCardProps {
  service: BusArrivalService;
  stopCode: string;
  stopDescription: string;
  onSetAlert: (serviceNo: string, stopCode: string, stopDescription: string) => void;
  onTrackOnMap: (serviceNo: string, nextBus: NextBus | null) => void;
  onViewRoute: (serviceNo: string) => void;
  isAlertActive?: boolean;
}

// Helpers for Singapore LTA visual badges
const getLoadInfo = (load?: LoadLevel) => {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats Avail',
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        desc: 'Seats Available'
      };
    case 'SDA':
      return {
        label: 'Standing',
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        desc: 'Standing Available'
      };
    case 'LSD':
      return {
        label: 'Limited',
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        dot: 'bg-rose-400',
        desc: 'Limited Standing'
      };
    default:
      return {
        label: 'No Data',
        bg: 'bg-slate-800 text-slate-400 border-slate-700',
        dot: 'bg-slate-500',
        desc: 'Timing not available'
      };
  }
};

const getBusTypeLabel = (type?: BusType) => {
  switch (type) {
    case 'DD':
      return { label: 'Double Deck', short: 'DD', isDouble: true };
    case 'BD':
      return { label: 'Bendy', short: 'BD', isDouble: false };
    case 'SD':
    default:
      return { label: 'Single Deck', short: 'SD', isDouble: false };
  }
};

const formatArrivalText = (sec: number | undefined) => {
  if (sec === undefined) return '-';
  if (sec <= 10) return 'Arr';
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;
  if (mins === 0) return `${remainingSecs}s`;
  return `${mins}m`;
};

const formatSecondsDisplay = (sec: number | undefined) => {
  if (sec === undefined || sec < 0) return '';
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;
  return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
};

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  stopCode,
  stopDescription,
  onSetAlert,
  onTrackOnMap,
  onViewRoute,
  isAlertActive = false
}) => {
  const nextBus = service.nextBus;
  const nextBus2 = service.nextBus2;
  const nextBus3 = service.nextBus3;

  const loadInfo1 = getLoadInfo(nextBus?.load);
  const typeInfo1 = getBusTypeLabel(nextBus?.type);

  const isArr1 = (nextBus?.estimatedSeconds ?? 999) <= 10;

  return (
    <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-xl p-4 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Service No & Route Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-12 bg-emerald-700 rounded-lg flex items-center justify-center shadow-md border border-emerald-500/40">
              <span className="text-xl font-extrabold text-white tracking-tight font-mono">
                {service.serviceNo}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">
              {service.operator}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 truncate">
                To {service.destination}
              </span>
              <span className="text-[11px] text-slate-400 shrink-0">
                via {service.category}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              {nextBus && (
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  {formatSecondsDisplay(nextBus.estimatedSeconds)}
                </span>
              )}
              {nextBus?.licensePlate && (
                <span className="font-mono text-slate-400 text-[11px]">
                  {nextBus.licensePlate}
                </span>
              )}
              {nextBus?.stopsAway !== undefined && (
                <span className="text-slate-400 text-[11px]">
                  {nextBus.stopsAway === 0 ? 'Approaching' : `${nextBus.stopsAway} stops away`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Arrival Timings (3 next buses) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Bus 1 */}
          <div
            className={`min-w-[80px] p-2 rounded-lg border text-center transition-all ${
              isArr1
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'bg-slate-900/90 border-slate-700/80 text-white'
            }`}
          >
            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>Next</span>
              {nextBus?.type === 'DD' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-600 font-bold">
                  DD
                </span>
              )}
            </div>
            <div className="text-lg font-bold font-mono tracking-tight my-0.5">
              {formatArrivalText(nextBus?.estimatedSeconds)}
            </div>
            {nextBus && (
              <div
                className={`text-[9px] font-semibold px-1 py-0.5 rounded border inline-flex items-center gap-1 ${loadInfo1.bg}`}
                title={`${loadInfo1.desc} · ${typeInfo1.label}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${loadInfo1.dot}`} />
                <span>{loadInfo1.label}</span>
              </div>
            )}
          </div>

          {/* Bus 2 */}
          <div className="min-w-[70px] p-2 rounded-lg bg-slate-900/70 border border-slate-700/70 text-center">
            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>2nd</span>
              {nextBus2?.type === 'DD' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-600 font-bold">
                  DD
                </span>
              )}
            </div>
            <div className="text-base font-semibold font-mono tracking-tight text-slate-200 my-0.5">
              {formatArrivalText(nextBus2?.estimatedSeconds)}
            </div>
            {nextBus2 && (
              <div
                className={`text-[9px] font-semibold px-1 py-0.5 rounded border inline-flex items-center gap-1 ${getLoadInfo(nextBus2.load).bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getLoadInfo(nextBus2.load).dot}`} />
                <span>{getLoadInfo(nextBus2.load).label}</span>
              </div>
            )}
          </div>

          {/* Bus 3 */}
          <div className="hidden xs:block min-w-[70px] p-2 rounded-lg bg-slate-900/50 border border-slate-750 text-center opacity-85">
            <div className="text-[10px] text-slate-400 font-medium">3rd</div>
            <div className="text-sm font-semibold font-mono tracking-tight text-slate-300 my-0.5">
              {formatArrivalText(nextBus3?.estimatedSeconds)}
            </div>
            {nextBus3 && (
              <div
                className={`text-[9px] font-semibold px-1 py-0.5 rounded border inline-flex items-center gap-1 ${getLoadInfo(nextBus3.load).bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getLoadInfo(nextBus3.load).dot}`} />
                <span>{getLoadInfo(nextBus3.load).label}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer bar: Interactive controls */}
      <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1 text-[11px]" title="Wheelchair Accessible">
            <Accessibility className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300">WAB</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{typeInfo1.label}</span>
          </span>
          {nextBus?.speedKmh !== undefined && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span>{nextBus.speedKmh} km/h</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetAlert(service.serviceNo, stopCode, stopDescription)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isAlertActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60 border border-slate-700'
            }`}
            title="Alert when bus approaches"
          >
            <Bell className={`w-3.5 h-3.5 ${isAlertActive ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isAlertActive ? 'Alert Set' : 'Set Alert'}</span>
          </button>

          <button
            onClick={() => onTrackOnMap(service.serviceNo, nextBus)}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-600/40 flex items-center gap-1.5 transition-colors"
            title="Track live location on map"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Track Live</span>
          </button>

          <button
            onClick={() => onViewRoute(service.serviceNo)}
            className="px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors flex items-center gap-0.5"
            title="View entire route and upcoming stops"
          >
            <span>Route</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
