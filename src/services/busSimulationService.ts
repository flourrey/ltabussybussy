import {
  BusStop,
  BusArrivalService,
  NextBus,
  ActiveBusPin,
  LoadLevel,
  BusType,
  BusFeature,
  Operator
} from '../types/transit';
import { SINGAPORE_BUS_STOPS, SINGAPORE_BUS_ROUTES } from '../data/singaporeBusData';

// Haversine distance in meters
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Format meters to human readable
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Walking time estimate (80 meters / min)
export function estimateWalkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

// Interpolate GPS coordinate along polyline given a completion fraction (0 to 1)
export function getPositionAlongPath(
  path: [number, number][],
  fraction: number
): { lat: number; lng: number; bearing: number } {
  if (!path || path.length === 0) return { lat: 1.2932, lng: 103.8522, bearing: 0 };
  if (path.length === 1) return { lat: path[0][0], lng: path[0][1], bearing: 0 };

  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const totalSegments = path.length - 1;
  const segmentProgress = clampedFraction * totalSegments;
  const index = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const subFraction = segmentProgress - index;

  const [lat1, lng1] = path[index];
  const [lat2, lng2] = path[index + 1];

  const lat = lat1 + (lat2 - lat1) * subFraction;
  const lng = lng1 + (lng2 - lng1) * subFraction;

  // Calculate bearing in degrees
  const y = Math.sin((lng2 - lng1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos((lng2 - lng1) * (Math.PI / 180));
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  const normalizedBearing = (bearing + 360) % 360;

  return { lat, lng, bearing: Math.round(normalizedBearing) };
}

// Generate deterministic license plate for consistent bus tracking
const LICENSE_PREFIXES = ['SG', 'SBS', 'SMB'];
function generateLicensePlate(serviceNo: string, offsetIndex: number): string {
  const num = (parseInt(serviceNo.replace(/\D/g, '') || '88', 10) * 113 + offsetIndex * 71) % 9000 + 1000;
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const checkLetter = letters[(num * 3 + offsetIndex) % letters.length];
  const prefix = LICENSE_PREFIXES[(num + offsetIndex) % LICENSE_PREFIXES.length];
  return `${prefix}${num}${checkLetter}`;
}

export interface SimulationState {
  timeOffsetSeconds: number; // dynamically ticks every second
}

// State tracker
let currentOffsetSeconds = 0;
setInterval(() => {
  currentOffsetSeconds += 1;
}, 1000);

export function getCurrentOffsetSeconds(): number {
  return currentOffsetSeconds;
}

// Generate realistic LTA Datamall v3 arrival times for a bus stop
export function getBusArrivalsForStop(stopCode: string, elapsedSeconds: number = currentOffsetSeconds): BusArrivalService[] {
  const stop = SINGAPORE_BUS_STOPS.find(s => s.code === stopCode);
  if (!stop) return [];

  const now = Date.now();

  return stop.services.map((serviceNo, sIdx) => {
    const route = SINGAPORE_BUS_ROUTES[serviceNo];
    const operator: Operator = route?.operator || (['SBST', 'SMRT', 'TTS', 'GAS'][sIdx % 4] as Operator);
    const origin = route?.origin || 'Regional Interchange';
    const destination = route?.destination || 'City Centre Terminal';
    const category = route?.category || 'Trunk';

    // Base interval for this service (e.g. 360 to 720 seconds = 6 to 12 mins)
    const headway = 360 + ((sIdx * 73 + parseInt(serviceNo.replace(/\D/g, '') || '10', 10) * 23) % 240);

    // Calculate remaining seconds for bus 1, 2, and 3
    const cycleTime = headway * 3;
    const baseOffset = (parseInt(stopCode, 10) * 17 + sIdx * 197) % headway;
    const relativeTime = (elapsedSeconds + baseOffset) % cycleTime;

    // Bus 1 arrival
    let sec1 = headway - (relativeTime % headway);
    if (sec1 <= 15) {
      sec1 = -10; // "Arr" (arriving / at stop for 25 seconds)
    }

    // Bus 2 arrival (roughly 1 headway after bus 1)
    const sec2 = (sec1 < 0 ? 0 : sec1) + headway + ((sIdx * 37) % 120);

    // Bus 3 arrival
    const sec3 = sec2 + headway + ((sIdx * 53) % 180);

    // Helper to generate NextBus payload
    const createNextBus = (sec: number, busIndex: number): NextBus => {
      const etaDate = new Date(now + Math.max(0, sec) * 1000);

      // Determine load
      const loadFactor = (parseInt(stopCode, 10) + sIdx * 5 + busIndex * 7 + Math.floor(elapsedSeconds / 300)) % 10;
      let load: LoadLevel = 'SEA';
      let crowdPercent = 20 + loadFactor * 5;
      if (loadFactor >= 7) {
        load = 'LSD';
        crowdPercent = 88 + (loadFactor - 7) * 4;
      } else if (loadFactor >= 4) {
        load = 'SDA';
        crowdPercent = 60 + (loadFactor - 4) * 8;
      }

      // Deck type
      const isDoubleDecker = (parseInt(serviceNo.replace(/\D/g, '') || '1', 10) + busIndex) % 3 !== 0;
      const type: BusType = isDoubleDecker ? 'DD' : ((sIdx + busIndex) % 7 === 0 ? 'BD' : 'SD');

      // Wheelchair accessibility (99% of Singapore fleet is WAB)
      const feature: BusFeature = 'WAB';

      // Live position calculation: where is this incoming bus right now?
      const stopsAway = Math.max(0, Math.ceil(sec / 150));
      const speedKmh = sec <= 0 ? 0 : 25 + ((sIdx * 7 + busIndex * 13) % 25);

      // Estimate coordinates along polyline towards current stop
      let latitude = stop.latitude;
      let longitude = stop.longitude;
      let bearing = 180;

      if (route && route.polyline.length > 0) {
        // Find current stop in route sequence
        const stopIndex = route.stops.findIndex(st => st.stopCode === stopCode);
        const totalStops = Math.max(1, route.stops.length);
        const currentProgress = stopIndex >= 0 ? stopIndex / totalStops : 0.5;

        // The bus is arriving, so its progress is slightly before this stop
        const busProgress = Math.max(0.05, currentProgress - (Math.max(0, sec) / (headway * 2.5)));
        const pos = getPositionAlongPath(route.polyline, busProgress);
        latitude = pos.lat;
        longitude = pos.lng;
        bearing = pos.bearing;
      } else {
        // Small realistic offset if polyline not defined
        const offsetDist = (Math.max(0, sec) / 300) * 0.008;
        latitude = stop.latitude + offsetDist * 0.7;
        longitude = stop.longitude - offsetDist * 0.5;
      }

      return {
        originCode: route ? route.stops[0]?.stopCode || stopCode : stopCode,
        destinationCode: route ? route.stops[route.stops.length - 1]?.stopCode || stopCode : stopCode,
        estimatedArrival: etaDate.toISOString(),
        estimatedSeconds: sec,
        latitude,
        longitude,
        visitNumber: 1,
        load,
        feature,
        type,
        licensePlate: generateLicensePlate(serviceNo, busIndex + 1),
        speedKmh,
        bearing,
        stopsAway,
        crowdPercent
      };
    };

    return {
      serviceNo,
      operator,
      category,
      origin,
      destination,
      nextBus: createNextBus(sec1, 0),
      nextBus2: createNextBus(sec2, 1),
      nextBus3: createNextBus(sec3, 2)
    };
  });
}

// Generate all currently active buses in Singapore network for map view
export function getActiveBusesOnMap(elapsedSeconds: number = currentOffsetSeconds): ActiveBusPin[] {
  const activeBuses: ActiveBusPin[] = [];

  Object.values(SINGAPORE_BUS_ROUTES).forEach(route => {
    // Each route has 3 to 5 active buses on the road simultaneously
    const totalBuses = 4;
    for (let i = 0; i < totalBuses; i++) {
      // Progress along route (0 to 1) cycles with time
      const cycleDuration = 1800; // 30 minutes for a full route
      const offset = (i / totalBuses) * cycleDuration;
      const progress = ((elapsedSeconds + offset) % cycleDuration) / cycleDuration;

      const pos = getPositionAlongPath(route.polyline, progress);

      // Determine which stop is next
      const stopIndex = Math.min(
        Math.floor(progress * route.stops.length),
        route.stops.length - 1
      );
      const nextStop = route.stops[stopIndex] || route.stops[0];

      // ETA to that next stop in seconds
      const etaNextStopSeconds = Math.max(10, Math.round((1 - (progress * route.stops.length - stopIndex)) * 180));

      const loadValues: LoadLevel[] = ['SEA', 'SEA', 'SDA', 'LSD', 'SEA'];
      const load = loadValues[(i + Math.floor(elapsedSeconds / 600)) % loadValues.length];
      const crowdPercent = load === 'SEA' ? 25 + i * 8 : (load === 'SDA' ? 62 + i * 5 : 92);
      const type: BusType = i % 2 === 0 ? 'DD' : 'SD';

      activeBuses.push({
        licensePlate: generateLicensePlate(route.serviceNo, i + 1),
        serviceNo: route.serviceNo,
        direction: route.direction,
        latitude: pos.lat,
        longitude: pos.lng,
        bearing: pos.bearing,
        speedKmh: 28 + ((i * 11) % 26),
        load,
        type,
        feature: 'WAB',
        nextStopCode: nextStop.stopCode,
        nextStopDescription: nextStop.description,
        etaNextStopSeconds,
        crowdPercent,
        destination: route.destination,
        operator: route.operator
      });
    }
  });

  return activeBuses;
}

// Standard Singapore distance fare calculator (Adult SimplyGo / EZ-Link)
export function calculateFare(distanceKm: number): {
  adult: number;
  senior: number;
  student: number;
  stage: string;
} {
  let adult = 1.09;
  let senior = 0.65;
  let student = 0.48;

  if (distanceKm <= 3.2) {
    adult = 1.09;
  } else if (distanceKm <= 4.2) {
    adult = 1.19;
  } else if (distanceKm <= 5.2) {
    adult = 1.29;
  } else if (distanceKm <= 6.2) {
    adult = 1.39;
  } else if (distanceKm <= 7.2) {
    adult = 1.48;
  } else if (distanceKm <= 8.2) {
    adult = 1.56;
  } else if (distanceKm <= 10.2) {
    adult = 1.70;
  } else if (distanceKm <= 15.2) {
    adult = 1.95;
  } else if (distanceKm <= 20.2) {
    adult = 2.15;
  } else {
    adult = 2.37;
  }

  senior = Math.round((adult * 0.58) * 100) / 100;
  student = Math.round((adult * 0.44) * 100) / 100;

  return {
    adult,
    senior,
    student,
    stage: `${distanceKm.toFixed(1)} km band`
  };
}
