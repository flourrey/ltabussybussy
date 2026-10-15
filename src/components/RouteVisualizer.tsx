import React, { useState } from 'react';
import { SINGAPORE_BUS_ROUTES, SINGAPORE_BUS_STOPS } from '../data/singaporeBusData';
import { ActiveBusPin, BusStop } from '../types/transit';
import { calculateFare } from '../services/busSimulationService';
import {
  Clock,
  Navigation,
  MapPin,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Bus,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface RouteVisualizerProps {
  initialServiceNo?: string;
  activeBuses: ActiveBusPin[];
  onSelectStop: (stop: BusStop) => void;
  onTrackBusOnMap: (serviceNo: string) => void;
}

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
  initialServiceNo = '190',
  activeBuses,
  onSelectStop,
  onTrackBusOnMap
}) => {
  const [selectedService, setSelectedService] = useState<string>(initialServiceNo);
  const route = SINGAPORE_BUS_ROUTES[selectedService] || SINGAPORE_BUS_ROUTES['190'];

  const servicesList = Object.keys(SINGAPORE_BUS_ROUTES);

  // Active buses running on this route
  const currentRouteBuses = activeBuses.filter(b => b.serviceNo === selectedService);

  // Total route distance
  const totalDistance = route.stops[route.stops.length - 1]?.distanceKm || 20;
  const fare = calculateFare(totalDistance);

  return (
    <div className="space-y-6">
      {/* Route Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Singapore Bus Route Directory
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Service {route.serviceNo}: {route.origin} → {route.destination}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {servicesList.map(srv => (
              <button
                key={srv}
                onClick={() => setSelectedService(srv)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedService === srv
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>

        {/* Route Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Operating Hours</span>
            <span className="font-semibold text-slate-200 font-mono">
              {route.firstBus} – {route.lastBus}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Peak / Off-Peak Freq</span>
            <span className="font-semibold text-emerald-400 font-mono">
              {route.frequencyPeak} / {route.frequencyOffPeak}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Total Route Length</span>
            <span className="font-semibold text-slate-200 font-mono">
              {totalDistance.toFixed(1)} km ({route.stops.length} major stops)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Adult Card Fare</span>
            <span className="font-semibold text-emerald-400 font-mono">
              ${fare.adult.toFixed(2)} (SimplyGo)
            </span>
          </div>
        </div>
      </div>

      {/* Main Stops Sequence & Live Bus Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Route Stop Sequence</h3>
              <p className="text-xs text-slate-400">
                Live buses shown on the line. Tap any stop to inspect arrival timings.
              </p>
            </div>
          </div>

          <button
            onClick={() => onTrackBusOnMap(selectedService)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 flex items-center gap-1.5 transition-colors"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>View All on Map</span>
          </button>
        </div>

        {/* Route Line Sequence */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-emerald-600/40 before:rounded-full">
          {route.stops.map((stopItem, index) => {
            const fullStop = SINGAPORE_BUS_STOPS.find(s => s.code === stopItem.stopCode);
            const isFirst = index === 0;
            const isLast = index === route.stops.length - 1;

            // Check if there is an active bus currently near or heading to this stop
            const busAtThisStop = currentRouteBuses.find(
              b => b.nextStopCode === stopItem.stopCode
            );

            const stopFare = calculateFare(stopItem.distanceKm);

            return (
              <div key={stopItem.stopCode} className="relative group">
                {/* Node circle on the line */}
                <div
                  className={`absolute -left-[27px] sm:-left-[31px] top-1.5 w-5 h-5 rounded-full border-2 ${
                    isFirst || isLast
                      ? 'bg-emerald-500 border-white'
                      : 'bg-slate-900 border-emerald-500 group-hover:scale-125'
                  } transition-transform shadow-md flex items-center justify-center z-10`}
                >
                  {(isFirst || isLast) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>

                {/* Stop Card */}
                <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
                          {stopItem.stopCode}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {stopItem.description}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>{stopItem.roadName}</span>
                        <span>·</span>
                        <span className="font-mono">{stopItem.distanceKm.toFixed(1)} km</span>
                        <span>·</span>
                        <span className="text-slate-300 font-mono">
                          ${stopFare.adult.toFixed(2)} fare
                        </span>
                      </div>

                      {/* MRT Interchange badges */}
                      {fullStop?.mrtConnections && fullStop.mrtConnections.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {fullStop.mrtConnections.map(mrt => (
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
                    </div>

                    {/* Right side: Action or Live bus marker */}
                    <div className="flex items-center gap-3">
                      {busAtThisStop && (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
                          <Bus className="w-3.5 h-3.5" />
                          <span>
                            Bus {busAtThisStop.licensePlate} arriving (~
                            {Math.round(busAtThisStop.etaNextStopSeconds / 60)}m)
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (fullStop) onSelectStop(fullStop);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-700/60 hover:bg-slate-700 transition-colors flex items-center gap-1"
                      >
                        <span>Arrivals</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
