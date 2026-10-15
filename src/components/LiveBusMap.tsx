import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  ActiveBusPin,
  BusStop,
  NextBus
} from '../types/transit';
import { SINGAPORE_BUS_STOPS, SINGAPORE_BUS_ROUTES } from '../data/singaporeBusData';
import {
  Layers,
  Locate,
  Compass,
  Bus,
  Accessibility,
  X,
  Gauge,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface LiveBusMapProps {
  activeBuses: ActiveBusPin[];
  selectedStop: BusStop | null;
  onSelectStop: (stop: BusStop) => void;
  highlightService?: string | null;
  userLocation: { lat: number; lng: number } | null;
  onSelectService: (serviceNo: string) => void;
}

export const LiveBusMap: React.FC<LiveBusMapProps> = ({
  activeBuses,
  selectedStop,
  onSelectStop,
  highlightService,
  userLocation,
  onSelectService
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedBus, setSelectedBus] = useState<ActiveBusPin | null>(null);
  const [filterService, setFilterService] = useState<string>(highlightService || 'ALL');
  const [mapTheme, setMapTheme] = useState<'dark' | 'voyager'>('dark');

  // Available services list for quick filter
  const allServices = ['ALL', '190', '65', '143', '36', '857', '12', '7', '960'];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = selectedStop ? selectedStop.latitude : 1.2980;
    const initialLng = selectedStop ? selectedStop.longitude : 103.8500;
    const initialZoom = selectedStop ? 15 : 13;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // CartoDB Dark Matter tiles for clean transit aesthetic
    const tileUrl =
      mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);
  }, [mapTheme]);

  // Sync highlightService prop
  useEffect(() => {
    if (highlightService) {
      setFilterService(highlightService);
    }
  }, [highlightService]);

  // Render Bus Stops
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous stop markers
    stopMarkersRef.current.forEach(marker => map.removeLayer(marker));
    stopMarkersRef.current.clear();

    SINGAPORE_BUS_STOPS.forEach(stop => {
      const isSelected = selectedStop?.code === stop.code;

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div class="group relative flex items-center justify-center cursor-pointer">
            <div class="w-6 h-6 rounded-full ${
              isSelected
                ? 'bg-emerald-500 ring-4 ring-emerald-400/50 scale-125'
                : 'bg-slate-800 border-2 border-emerald-500/80 hover:bg-emerald-600'
            } text-white flex items-center justify-center shadow-lg transition-transform">
              <span class="text-[9px] font-extrabold font-mono">${stop.code.slice(0, 3)}</span>
            </div>
            <div class="absolute -top-7 hidden group-hover:flex whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg border border-slate-700 pointer-events-none z-50">
              ${stop.description} (${stop.code})
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
        .addTo(map)
        .on('click', () => {
          onSelectStop(stop);
        });

      stopMarkersRef.current.set(stop.code, marker);
    });
  }, [selectedStop, onSelectStop]);

  // Render Route Polyline when a service is filtered or active
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (filterService !== 'ALL' && SINGAPORE_BUS_ROUTES[filterService]) {
      const route = SINGAPORE_BUS_ROUTES[filterService];
      const polyline = L.polyline(route.polyline, {
        color: '#10b981', // Emerald-500
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map bounds to route if desired
      if (!selectedStop) {
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }
    }
  }, [filterService, selectedStop]);

  // Render & Animate Active Buses
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const filteredBuses =
      filterService === 'ALL'
        ? activeBuses
        : activeBuses.filter(b => b.serviceNo === filterService);

    const currentPlates = new Set(filteredBuses.map(b => b.licensePlate));

    // Remove obsolete markers
    busMarkersRef.current.forEach((marker, plate) => {
      if (!currentPlates.has(plate)) {
        map.removeLayer(marker);
        busMarkersRef.current.delete(plate);
      }
    });

    // Add or update markers
    filteredBuses.forEach(bus => {
      const isSelected = selectedBus?.licensePlate === bus.licensePlate;

      // Load color badge
      const loadColor =
        bus.load === 'SEA'
          ? 'bg-emerald-500'
          : bus.load === 'SDA'
          ? 'bg-amber-500'
          : 'bg-rose-500';

      const busHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${
          isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
        }">
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
            isSelected
              ? 'bg-slate-900 text-emerald-300 ring-2 ring-emerald-400'
              : 'bg-slate-900/90 text-white border border-slate-700'
          } shadow-xl backdrop-blur-sm">
            <span class="w-1.5 h-1.5 rounded-full ${loadColor}"></span>
            <span class="text-[11px] font-extrabold font-mono tracking-tight">${bus.serviceNo}</span>
            <span class="text-[8px] font-bold text-slate-300 px-0.5 rounded bg-slate-800">${bus.type}</span>
          </div>
          <!-- Heading direction indicator arrow -->
          <div style="transform: rotate(${bus.bearing}deg);" class="absolute -top-1 w-2 h-2 text-emerald-400 pointer-events-none">
            ▲
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: busHtml,
        iconSize: [48, 24],
        iconAnchor: [24, 12]
      });

      if (busMarkersRef.current.has(bus.licensePlate)) {
        const marker = busMarkersRef.current.get(bus.licensePlate)!;
        marker.setLatLng([bus.latitude, bus.longitude]);
        marker.setIcon(busIcon);
      } else {
        const marker = L.marker([bus.latitude, bus.longitude], { icon: busIcon })
          .addTo(map)
          .on('click', () => {
            setSelectedBus(bus);
            map.panTo([bus.latitude, bus.longitude]);
          });
        busMarkersRef.current.set(bus.licensePlate, marker);
      }
    });
  }, [activeBuses, filterService, selectedBus]);

  // User location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-white shadow-md"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon
      }).addTo(map);
    }
  }, [userLocation]);

  // Center on Selected Stop
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedStop) return;
    mapInstanceRef.current.panTo([selectedStop.latitude, selectedStop.longitude], {
      animate: true,
      duration: 0.8
    });
  }, [selectedStop]);

  const handleCenterSingapore = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([1.2980, 103.8500], 13);
  };

  const handleCenterUser = () => {
    if (!mapInstanceRef.current || !userLocation) return;
    mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Bar: Filter Services */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg">
        <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
          <Bus className="w-3.5 h-3.5 text-emerald-400" />
          Filter:
        </span>
        {allServices.map(srv => (
          <button
            key={srv}
            onClick={() => setFilterService(srv)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              filterService === srv
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {srv}
          </button>
        ))}
      </div>

      {/* Map Action Buttons (Top Right) */}
      <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-1.5">
        <button
          onClick={() => setMapTheme(t => (t === 'dark' ? 'voyager' : 'dark'))}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          title="Toggle Dark / Day Map"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenterSingapore}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          title="Center on Central Singapore"
        >
          <Compass className="w-4 h-4" />
        </button>
        {userLocation && (
          <button
            onClick={handleCenterUser}
            className="p-2 rounded-xl bg-blue-600/90 backdrop-blur-md border border-blue-400/80 text-white hover:bg-blue-500 transition-all shadow-lg"
            title="Center on My Location"
          >
            <Locate className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active Bus Telemetry Drawer (Floating on bottom left) */}
      {selectedBus && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-mono font-extrabold text-lg shadow-md">
                {selectedBus.serviceNo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-100">
                    {selectedBus.licensePlate}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                    {selectedBus.operator}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate max-w-[200px]">
                  To {selectedBus.destination}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBus(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Next Stop ETA</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {Math.round(selectedBus.etaNextStopSeconds / 60)} min
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Current Speed</span>
              <span className="text-sm font-bold font-mono text-slate-200">
                {selectedBus.speedKmh} km/h
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Deck Type</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {selectedBus.type === 'DD' ? 'Double' : 'Single'}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg">
            <span className="truncate">Next: <strong className="text-slate-100">{selectedBus.nextStopDescription}</strong></span>
            <button
              onClick={() => {
                onSelectService(selectedBus.serviceNo);
                setSelectedBus(null);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Route</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Right on desktop) */}
      <div className="absolute bottom-3 left-3 z-10 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/70 text-[11px] text-slate-300">
        <span className="text-slate-400">Crowd Level:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Seats Avail
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Standing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          Limited
        </span>
      </div>
    </div>
  );
};
