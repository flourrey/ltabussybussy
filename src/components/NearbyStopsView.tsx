import React, { useState } from 'react';
import { SINGAPORE_BUS_STOPS, SINGAPORE_POPULAR_DISTRICTS } from '../data/singaporeBusData';
import { BusStop } from '../types/transit';
import {
  calculateDistanceMeters,
  formatDistance,
  estimateWalkMinutes
} from '../services/busSimulationService';
import {
  Locate,
  MapPin,
  Footprints,
  Bus,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NearbyStopsViewProps {
  userLocation: { lat: number; lng: number } | null;
  onLocateUser: () => void;
  onSelectStop: (stop: BusStop) => void;
  isLocating: boolean;
}

export const NearbyStopsView: React.FC<NearbyStopsViewProps> = ({
  userLocation,
  onLocateUser,
  onSelectStop,
  isLocating
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('City Hall & Bugis');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState<number>(1500); // 1.5 km

  // Effective anchor point (user GPS or selected district)
  const activeDistrict = SINGAPORE_POPULAR_DISTRICTS.find(d => d.name === selectedDistrict);
  const anchorLat = userLocation?.lat ?? activeDistrict?.lat ?? 1.2974;
  const anchorLng = userLocation?.lng ?? activeDistrict?.lng ?? 103.8528;

  // Calculate distance for all stops and sort
  const stopsWithDistance = SINGAPORE_BUS_STOPS.map(stop => {
    const distMeters = calculateDistanceMeters(
      anchorLat,
      anchorLng,
      stop.latitude,
      stop.longitude
    );
    return {
      ...stop,
      distMeters,
      walkMins: estimateWalkMinutes(distMeters)
    };
  })
    .filter(stop => {
      // Radius filter
      if (stop.distMeters > radiusFilter) return false;
      // Search query filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        stop.code.includes(q) ||
        stop.description.toLowerCase().includes(q) ||
        stop.roadName.toLowerCase().includes(q) ||
        stop.services.some(s => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.distMeters - b.distMeters);

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Proximity Bus Stop Radar
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Nearby Singapore Bus Stops
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {userLocation
                ? 'Calculated from your current GPS location in Singapore'
                : `Currently centered on: ${selectedDistrict}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLocateUser}
              disabled={isLocating}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>
        </div>

        {/* District Shortcuts (Quick switch for commuters) */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Or Explore Key Transport Hubs:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {SINGAPORE_POPULAR_DISTRICTS.map(d => (
              <button
                key={d.name}
                onClick={() => {
                  setSelectedDistrict(d.name);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedDistrict === d.name && !userLocation
                    ? 'bg-emerald-600 text-white font-semibold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stop code, road, or service..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Search Radius:</span>
            {[500, 1000, 1500, 3000].map(rad => (
              <button
                key={rad}
                onClick={() => setRadiusFilter(rad)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  radiusFilter === rad
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rad < 1000 ? `${rad}m` : `${rad / 1000}km`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Stops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stopsWithDistance.map(stop => (
          <div
            key={stop.code}
            onClick={() => onSelectStop(stop)}
            className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-slate-700 group-hover:border-emerald-500/40 transition-colors">
                    {stop.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {stop.description}
                    </h3>
                    <p className="text-xs text-slate-400">{stop.roadName}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                    <Footprints className="w-3 h-3" />
                    {formatDistance(stop.distMeters)}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    ~{stop.walkMins} min walk
                  </span>
                </div>
              </div>

              {/* MRT Connections if any */}
              {stop.mrtConnections && stop.mrtConnections.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                  {stop.mrtConnections.map(mrt => (
                    <span
                      key={mrt.stationCode}
                      style={{ backgroundColor: mrt.color }}
                      className="text-white text-[10px] font-bold px-1.5 py-0.2 rounded shadow-sm font-mono"
                    >
                      {mrt.stationCode} {mrt.stationName}
                    </span>
                  ))}
                </div>
              )}

              {/* Bus services pill strip */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                  Available Bus Services:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stop.services.map(srv => (
                    <span
                      key={srv}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-slate-200"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View live arrival timings</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {stopsWithDistance.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400">
            No bus stops found within {radiusFilter >= 1000 ? `${radiusFilter / 1000}km` : `${radiusFilter}m`}.
          </p>
          <button
            onClick={() => setRadiusFilter(3000)}
            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
          >
            Expand search to 3km
          </button>
        </div>
      )}
    </div>
  );
};
