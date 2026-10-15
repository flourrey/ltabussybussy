import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BusStop,
  BusArrivalService,
  ActiveBusPin,
  CommuterAlert,
  NextBus
} from './types/transit';
import {
  SINGAPORE_BUS_STOPS,
  SINGAPORE_BUS_ROUTES,
  SINGAPORE_POPULAR_DISTRICTS
} from './data/singaporeBusData';
import {
  getBusArrivalsForStop,
  getActiveBusesOnMap,
  calculateDistanceMeters,
  formatDistance
} from './services/busSimulationService';
import { Header } from './components/Header';
import { BusArrivalCard } from './components/BusArrivalCard';
import { LiveBusMap } from './components/LiveBusMap';
import { RouteVisualizer } from './components/RouteVisualizer';
import { NearbyStopsView } from './components/NearbyStopsView';
import { SavedCommutesView } from './components/SavedCommutesView';
import { CommuterAlertModal } from './components/CommuterAlertModal';
import { BackendIntegrationModal } from './components/BackendIntegrationModal';
import {
  Search,
  MapPin,
  Bookmark,
  RefreshCw,
  SlidersHorizontal,
  Compass,
  Bus,
  Map,
  Route,
  Navigation,
  Info,
  Layers,
  ChevronDown,
  Check,
  BellRing
} from 'lucide-react';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'arrivals' | 'map' | 'routes' | 'nearby' | 'saved'>('arrivals');

  // Selected stop (defaults to iconic City Hall Stn)
  const [selectedStop, setSelectedStop] = useState<BusStop>(SINGAPORE_BUS_STOPS[0]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Time & Simulation Tick
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [singaporeTime, setSingaporeTime] = useState('');

  // Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Commuter Alerts
  const [alerts, setAlerts] = useState<CommuterAlert[]>([]);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [alertToast, setAlertToast] = useState<{ title: string; message: string } | null>(null);

  // Backend Integration Modal
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [customBackendUrl, setCustomBackendUrl] = useState('');

  // Saved/Bookmarked Stops (saved to localStorage)
  const [savedStopCodes, setSavedStopCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_saved_bus_stops');
      return saved ? JSON.parse(saved) : ['04111', '08057', '09022'];
    } catch {
      return ['04111', '08057', '09022'];
    }
  });

  // Track map highlights
  const [highlightService, setHighlightService] = useState<string | null>(null);

  // Real-time Singapore clock & simulation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);

      // Singapore Time (SGT, UTC+8)
      const now = new Date();
      const sgtString = now.toLocaleTimeString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setSingaporeTime(sgtString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync saved stops to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_saved_bus_stops', JSON.stringify(savedStopCodes));
    } catch (e) {
      console.error(e);
    }
  }, [savedStopCodes]);

  // Play audio chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio chime not supported in this browser environment', e);
    }
  };

  // Check alerts every 5 seconds
  useEffect(() => {
    alerts.forEach(alert => {
      if (alert.triggered) return;

      const arrivals = getBusArrivalsForStop(alert.stopCode, elapsedSeconds);
      const srv = arrivals.find(s => s.serviceNo === alert.serviceNo);
      if (srv && srv.nextBus) {
        const remainingMins = Math.ceil(srv.nextBus.estimatedSeconds / 60);
        if (remainingMins <= alert.targetMins) {
          // Trigger alert!
          playChime();
          setAlertToast({
            title: `Bus ${alert.serviceNo} Approaching!`,
            message: `Estimated arrival at ${alert.stopDescription} in ~${Math.max(1, remainingMins)} min`
          });

          // Mark triggered
          setAlerts(prev =>
            prev.map(a => (a.id === alert.id ? { ...a, triggered: true } : a))
          );

          // Clear toast after 6 seconds
          setTimeout(() => setAlertToast(null), 6000);
        }
      }
    });
  }, [elapsedSeconds, alerts]);

  // Compute live arrivals for currently selected stop
  const arrivals: BusArrivalService[] = useMemo(() => {
    return getBusArrivalsForStop(selectedStop.code, elapsedSeconds);
  }, [selectedStop.code, elapsedSeconds]);

  // Compute live buses across Singapore
  const activeBuses: ActiveBusPin[] = useMemo(() => {
    return getActiveBusesOnMap(elapsedSeconds);
  }, [elapsedSeconds]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setElapsedSeconds(s => s + 5);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    return SINGAPORE_BUS_STOPS.filter(stop => {
      return (
        stop.code.includes(q) ||
        stop.description.toLowerCase().includes(q) ||
        stop.roadName.toLowerCase().includes(q) ||
        stop.services.some(s => s.toLowerCase() === q || s.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [searchQuery]);

  // Toggle saved stop
  const handleToggleSaveStop = (code: string) => {
    setSavedStopCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Add alert
  const handleSetAlert = (serviceNo: string, stopCode: string, stopDescription: string) => {
    const existing = alerts.find(a => a.serviceNo === serviceNo && a.stopCode === stopCode);
    if (existing) {
      setIsAlertsModalOpen(true);
      return;
    }

    const newAlert: CommuterAlert = {
      id: `${serviceNo}-${stopCode}-${Date.now()}`,
      serviceNo,
      stopCode,
      stopDescription,
      targetMins: 2,
      createdAt: Date.now(),
      triggered: false
    };

    setAlerts(prev => [...prev, newAlert]);
    setAlertToast({
      title: `Alert Set for Bus ${serviceNo}`,
      message: `You'll receive a chime when Bus ${serviceNo} is within 2 minutes of ${stopDescription}.`
    });
    setTimeout(() => setAlertToast(null), 4000);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Request HTML5 Geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Find nearest stop to user
        let nearestStop = SINGAPORE_BUS_STOPS[0];
        let minDistance = Infinity;

        SINGAPORE_BUS_STOPS.forEach(stop => {
          const d = calculateDistanceMeters(latitude, longitude, stop.latitude, stop.longitude);
          if (d < minDistance) {
            minDistance = d;
            nearestStop = stop;
          }
        });

        if (minDistance < 1500) {
          setSelectedStop(nearestStop);
        }
      },
      err => {
        setIsLocating(false);
        console.warn('Geolocation access denied or unavailable; defaulting to Singapore City Hall.', err);
        // Fallback default coordinate (Central Singapore)
        setUserLocation({ lat: 1.2932, lng: 103.8522 });
      },
      { timeout: 8000 }
    );
  };

  const isCurrentStopSaved = savedStopCodes.includes(selectedStop.code);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8 selection:bg-emerald-500 selection:text-white">
      {/* Toast Alert Banner */}
      {alertToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-200 border-2 border-amber-300">
          <BellRing className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider">{alertToast.title}</h4>
            <p className="text-xs font-semibold mt-0.5">{alertToast.message}</p>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        activeAlertCount={alerts.filter(a => !a.triggered).length}
        isRefreshing={isRefreshing}
        onManualRefresh={handleManualRefresh}
        singaporeTime={singaporeTime || '14:38:12'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: BUS ARRIVALS BOARD */}
        {activeTab === 'arrivals' && (
          <div className="space-y-6">
            {/* Stop Selector & Search Hero Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search input with live autocomplete */}
                <div className="relative flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search by 5-digit bus stop code, road, or bus service (e.g. 04111, Orchard, 190)..."
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                    />
                  </div>

                  {/* Search Autocomplete Dropdown */}
                  {isSearchOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 max-h-72 overflow-y-auto">
                      <div className="p-2 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                        Singapore Bus Stops Matching &ldquo;{searchQuery}&rdquo;:
                      </div>
                      {searchResults.map(stop => (
                        <div
                          key={stop.code}
                          onClick={() => {
                            setSelectedStop(stop);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-none cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                              {stop.code}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">{stop.description}</div>
                              <div className="text-[11px] text-slate-400">{stop.roadName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {stop.services.slice(0, 4).map(s => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300"
                              >
                                {s}
                              </span>
                            ))}
                            {stop.services.length > 4 && (
                              <span className="text-[10px] text-slate-500">
                                +{stop.services.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Transport District Switcher */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    Quick Hubs:
                  </span>
                  {['04111', '08057', '09022', '03511', '05013'].map(code => {
                    const stop = SINGAPORE_BUS_STOPS.find(s => s.code === code);
                    if (!stop) return null;
                    const isSelected = selectedStop.code === code;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedStop(stop)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
                        }`}
                      >
                        {stop.description.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Bus Stop Title Header Card */}
              <div className="mt-5 pt-5 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    <span className="font-mono text-sm font-extrabold">{selectedStop.code}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                        {selectedStop.description}
                      </h2>
                      <button
                        onClick={() => handleToggleSaveStop(selectedStop.code)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isCurrentStopSaved
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={isCurrentStopSaved ? 'Saved stop' : 'Save this stop'}
                      >
                        <Bookmark className={`w-4 h-4 ${isCurrentStopSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {selectedStop.roadName}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{selectedStop.services.length} services</span>
                    </div>
                  </div>
                </div>

                {/* MRT connections & Map shortcut */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedStop.mrtConnections?.map(mrt => (
                    <span
                      key={mrt.stationCode}
                      style={{ backgroundColor: mrt.color }}
                      className="text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm font-mono"
                    >
                      {mrt.stationCode} {mrt.stationName}
                    </span>
                  ))}

                  <button
                    onClick={() => {
                      setActiveTab('map');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Map className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bus Services Arrival Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Service Arrivals ({arrivals.length})
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-syncing every second
                </span>
              </div>

              {arrivals.map(srv => {
                const isAlertActive = alerts.some(
                  a => a.serviceNo === srv.serviceNo && a.stopCode === selectedStop.code && !a.triggered
                );

                return (
                  <BusArrivalCard
                    key={srv.serviceNo}
                    service={srv}
                    stopCode={selectedStop.code}
                    stopDescription={selectedStop.description}
                    onSetAlert={handleSetAlert}
                    onTrackOnMap={serviceNo => {
                      setHighlightService(serviceNo);
                      setActiveTab('map');
                    }}
                    onViewRoute={serviceNo => {
                      setHighlightService(serviceNo);
                      setActiveTab('routes');
                    }}
                    isAlertActive={isAlertActive}
                  />
                );
              })}
            </div>

            {/* Official Singapore LTA Datamall Standards Legend */}
            <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-4 text-xs text-slate-400">
              <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>LTA Datamall Crowd & Fleet Specifications:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-slate-200">SEA</strong>: Seats Available (&gt;30% empty seats)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span>
                    <strong className="text-slate-200">SDA</strong>: Standing Available (Seats full)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                  <span>
                    <strong className="text-slate-200">LSD</strong>: Limited Standing (Boarding delay likely)
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-[11px] text-slate-400">
                <span>
                  <strong className="text-slate-300">DD</strong>: Double Decker (high passenger capacity)
                </span>
                <span>
                  <strong className="text-slate-300">SD</strong>: Single Deck standard city bus
                </span>
                <span>
                  <strong className="text-slate-300">WAB</strong>: Wheelchair Accessible Bus with ramp
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE BUS MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Live Singapore Bus Telemetry Map
                </h2>
                <p className="text-xs text-slate-400">
                  Tracking active buses along polyline corridors. Tap any bus or stop marker to inspect.
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {activeBuses.length} active buses online
              </div>
            </div>

            <LiveBusMap
              activeBuses={activeBuses}
              selectedStop={selectedStop}
              onSelectStop={stop => {
                setSelectedStop(stop);
                setActiveTab('arrivals');
              }}
              highlightService={highlightService}
              userLocation={userLocation}
              onSelectService={srv => {
                setHighlightService(srv);
                setActiveTab('routes');
              }}
            />
          </div>
        )}

        {/* TAB 3: ROUTE TRACKER & VISUALIZER */}
        {activeTab === 'routes' && (
          <RouteVisualizer
            initialServiceNo={highlightService || '190'}
            activeBuses={activeBuses}
            onSelectStop={stop => {
              setSelectedStop(stop);
              setActiveTab('arrivals');
            }}
            onTrackBusOnMap={serviceNo => {
              setHighlightService(serviceNo);
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB 4: NEARBY BUS STOPS */}
        {activeTab === 'nearby' && (
          <NearbyStopsView
            userLocation={userLocation}
            onLocateUser={handleLocateUser}
            onSelectStop={stop => {
              setSelectedStop(stop);
              setActiveTab('arrivals');
            }}
            isLocating={isLocating}
          />
        )}

        {/* TAB 5: SAVED COMMUTES */}
        {activeTab === 'saved' && (
          <SavedCommutesView
            savedStopCodes={savedStopCodes}
            onToggleSaveStop={handleToggleSaveStop}
            onSelectStop={stop => {
              setSelectedStop(stop);
              setActiveTab('arrivals');
            }}
            elapsedSeconds={elapsedSeconds}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from mobile design constitution) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        <div className="grid grid-cols-5 items-center h-16 pb-safe px-1">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'arrivals' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Arrivals</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'map' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Live Map</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'routes' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Route className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'nearby' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Nearby</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'saved' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Saved</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CommuterAlertModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onRemoveAlert={handleRemoveAlert}
        onTestChime={playChime}
      />

      <BackendIntegrationModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        customBackendUrl={customBackendUrl}
        onSaveBackendUrl={url => setCustomBackendUrl(url)}
      />
    </div>
  );
}
