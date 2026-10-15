export type LoadLevel = 'SEA' | 'SDA' | 'LSD';
// SEA: Seats Available
// SDA: Standing Available
// LSD: Limited Standing

export type BusType = 'SD' | 'DD' | 'BD';
// SD: Single Deck
// DD: Double Decker
// BD: Bendy

export type BusFeature = 'WAB' | 'Non-WAB';
// WAB: Wheelchair Accessible Bus

export type Operator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface NextBus {
  originCode: string;
  destinationCode: string;
  estimatedArrival: string; // ISO date string
  estimatedSeconds: number; // remaining seconds until arrival
  latitude: number;
  longitude: number;
  visitNumber: number;
  load: LoadLevel;
  feature: BusFeature;
  type: BusType;
  licensePlate: string;
  speedKmh: number;
  bearing: number; // 0-360 degrees
  stopsAway: number;
  crowdPercent: number; // 0-100
}

export interface BusArrivalService {
  serviceNo: string;
  operator: Operator;
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  origin: string;
  destination: string;
  nextBus: NextBus | null;
  nextBus2: NextBus | null;
  nextBus3: NextBus | null;
}

export interface MRTConnection {
  stationCode: string; // e.g. "NS24", "EW13", "DT14", "BP1"
  stationName: string;
  line: 'NS' | 'EW' | 'NE' | 'CC' | 'DT' | 'TE' | 'BP';
  color: string;
}

export interface BusStop {
  code: string; // 5-digit code e.g. "04111"
  roadName: string;
  description: string;
  latitude: number;
  longitude: number;
  services: string[];
  mrtConnections?: MRTConnection[];
}

export interface RouteStopItem {
  stopCode: string;
  stopSeq: number;
  distanceKm: number;
  roadName: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface BusRouteInfo {
  serviceNo: string;
  direction: 1 | 2;
  origin: string;
  destination: string;
  operator: Operator;
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  firstBus: string;
  lastBus: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  stops: RouteStopItem[];
  polyline: [number, number][]; // [lat, lng] array
}

export interface CommuterAlert {
  id: string;
  serviceNo: string;
  stopCode: string;
  stopDescription: string;
  targetMins: number; // alert when minutes <= targetMins (e.g. 2 or 1)
  licensePlate?: string;
  createdAt: number;
  triggered: boolean;
}

export interface ActiveBusPin {
  licensePlate: string;
  serviceNo: string;
  direction: 1 | 2;
  latitude: number;
  longitude: number;
  bearing: number;
  speedKmh: number;
  load: LoadLevel;
  type: BusType;
  feature: BusFeature;
  nextStopCode: string;
  nextStopDescription: string;
  etaNextStopSeconds: number;
  crowdPercent: number;
  destination: string;
  operator: Operator;
}
