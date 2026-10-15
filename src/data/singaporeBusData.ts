import { BusStop, BusRouteInfo } from '../types/transit';

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  {
    code: '04111',
    roadName: 'North Bridge Rd',
    description: 'City Hall Stn Exit B',
    latitude: 1.2932,
    longitude: 103.8522,
    services: ['190', '65', '12', '147', '857'],
    mrtConnections: [
      { stationCode: 'NS25', stationName: 'City Hall', line: 'NS', color: '#d42e12' },
      { stationCode: 'EW13', stationName: 'City Hall', line: 'EW', color: '#009640' }
    ]
  },
  {
    code: '01012',
    roadName: 'Victoria St',
    description: 'Hotel Grand Pacific',
    latitude: 1.2974,
    longitude: 103.8528,
    services: ['7', '12', '190', '857'],
    mrtConnections: [
      { stationCode: 'DT21', stationName: 'Bencoolen', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '01112',
    roadName: 'Victoria St',
    description: 'Bugis Stn Exit A',
    latitude: 1.3008,
    longitude: 103.8561,
    services: ['7', '12', '190', '857', '960'],
    mrtConnections: [
      { stationCode: 'EW12', stationName: 'Bugis', line: 'EW', color: '#009640' },
      { stationCode: 'DT14', stationName: 'Bugis', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '08057',
    roadName: 'Orchard Rd',
    description: 'Dhoby Ghaut Stn',
    latitude: 1.2991,
    longitude: 103.8458,
    services: ['7', '36', '65', '190', '857'],
    mrtConnections: [
      { stationCode: 'NS24', stationName: 'Dhoby Ghaut', line: 'NS', color: '#d42e12' },
      { stationCode: 'NE6', stationName: 'Dhoby Ghaut', line: 'NE', color: '#8f1a95' },
      { stationCode: 'CC1', stationName: 'Dhoby Ghaut', line: 'CC', color: '#fa9e0d' }
    ]
  },
  {
    code: '09048',
    roadName: 'Somerset Rd',
    description: 'Opp Somerset Stn (313@Somerset)',
    latitude: 1.3006,
    longitude: 103.8385,
    services: ['7', '36', '65', '143', '190'],
    mrtConnections: [
      { stationCode: 'NS23', stationName: 'Somerset', line: 'NS', color: '#d42e12' }
    ]
  },
  {
    code: '09022',
    roadName: 'Orchard Rd',
    description: 'Orchard Stn / Lucky Plaza',
    latitude: 1.3040,
    longitude: 103.8335,
    services: ['7', '36', '65', '143', '190'],
    mrtConnections: [
      { stationCode: 'NS22', stationName: 'Orchard', line: 'NS', color: '#d42e12' },
      { stationCode: 'TE14', stationName: 'Orchard', line: 'TE', color: '#9d5b25' }
    ]
  },
  {
    code: '03211',
    roadName: 'Bras Basah Rd',
    description: 'Raffles Hotel',
    latitude: 1.2951,
    longitude: 103.8545,
    services: ['36', '65', '190', '857'],
    mrtConnections: [
      { stationCode: 'CC2', stationName: 'Bras Basah', line: 'CC', color: '#fa9e0d' }
    ]
  },
  {
    code: '02049',
    roadName: 'Temasek Blvd',
    description: 'Suntec Convention Ctr',
    latitude: 1.2938,
    longitude: 103.8584,
    services: ['36', '857'],
    mrtConnections: [
      { stationCode: 'CC3', stationName: 'Esplanade', line: 'CC', color: '#fa9e0d' },
      { stationCode: 'DT15', stationName: 'Promenade', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '03511',
    roadName: 'Bayfront Ave',
    description: 'Marina Bay Sands MICE',
    latitude: 1.2838,
    longitude: 103.8589,
    services: ['36', '960'],
    mrtConnections: [
      { stationCode: 'CE1', stationName: 'Bayfront', line: 'CC', color: '#fa9e0d' },
      { stationCode: 'DT16', stationName: 'Bayfront', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '04239',
    roadName: 'Eu Tong Sen St',
    description: 'Clarke Quay Stn Exit E',
    latitude: 1.2885,
    longitude: 103.8465,
    services: ['12', '143', '147', '190'],
    mrtConnections: [
      { stationCode: 'NE5', stationName: 'Clarke Quay', line: 'NE', color: '#8f1a95' }
    ]
  },
  {
    code: '05013',
    roadName: 'Eu Tong Sen St',
    description: 'Chinatown Stn Exit C (People\'s Park)',
    latitude: 1.2842,
    longitude: 103.8436,
    services: ['12', '143', '147', '190'],
    mrtConnections: [
      { stationCode: 'NE4', stationName: 'Chinatown', line: 'NE', color: '#8f1a95' },
      { stationCode: 'DT19', stationName: 'Chinatown', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '14141',
    roadName: 'Telok Blangah Rd',
    description: 'HarbourFront Stn / VivoCity',
    latitude: 1.2652,
    longitude: 103.8218,
    services: ['65', '143', '147'],
    mrtConnections: [
      { stationCode: 'NE1', stationName: 'HarbourFront', line: 'NE', color: '#8f1a95' },
      { stationCode: 'CC29', stationName: 'HarbourFront', line: 'CC', color: '#fa9e0d' }
    ]
  },
  {
    code: '28009',
    roadName: 'Jurong Gateway Rd',
    description: 'Jurong East Int',
    latitude: 1.3331,
    longitude: 103.7423,
    services: ['143', '147'],
    mrtConnections: [
      { stationCode: 'NS1', stationName: 'Jurong East', line: 'NS', color: '#d42e12' },
      { stationCode: 'EW24', stationName: 'Jurong East', line: 'EW', color: '#009640' }
    ]
  },
  {
    code: '84009',
    roadName: 'Tampines Central 1',
    description: 'Tampines Int',
    latitude: 1.3541,
    longitude: 103.9431,
    services: ['65', '12'],
    mrtConnections: [
      { stationCode: 'EW2', stationName: 'Tampines', line: 'EW', color: '#009640' },
      { stationCode: 'DT32', stationName: 'Tampines', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '54009',
    roadName: 'Bishan Place',
    description: 'Bishan Int (Junction 8)',
    latitude: 1.3504,
    longitude: 103.8488,
    services: ['857'],
    mrtConnections: [
      { stationCode: 'NS17', stationName: 'Bishan', line: 'NS', color: '#d42e12' },
      { stationCode: 'CC15', stationName: 'Bishan', line: 'CC', color: '#fa9e0d' }
    ]
  },
  {
    code: '52009',
    roadName: 'Lorong 6 Toa Payoh',
    description: 'Toa Payoh Int (HDB Hub)',
    latitude: 1.3328,
    longitude: 103.8475,
    services: ['143'],
    mrtConnections: [
      { stationCode: 'NS19', stationName: 'Toa Payoh', line: 'NS', color: '#d42e12' }
    ]
  },
  {
    code: '46009',
    roadName: 'Woodlands Sq',
    description: 'Woodlands Int (Causeway Point)',
    latitude: 1.4368,
    longitude: 103.7865,
    services: ['960'],
    mrtConnections: [
      { stationCode: 'NS9', stationName: 'Woodlands', line: 'NS', color: '#d42e12' },
      { stationCode: 'TE2', stationName: 'Woodlands', line: 'TE', color: '#9d5b25' }
    ]
  },
  {
    code: '95129',
    roadName: 'Airport Blvd',
    description: 'Changi Airport PTB2',
    latitude: 1.3551,
    longitude: 103.9886,
    services: ['36'],
    mrtConnections: [
      { stationCode: 'CG2', stationName: 'Changi Airport', line: 'EW', color: '#009640' }
    ]
  },
  {
    code: '44009',
    roadName: 'Choa Chu Kang Loop',
    description: 'Choa Chu Kang Int (Lot One)',
    latitude: 1.3853,
    longitude: 103.7444,
    services: ['190'],
    mrtConnections: [
      { stationCode: 'NS4', stationName: 'Choa Chu Kang', line: 'NS', color: '#d42e12' },
      { stationCode: 'BP1', stationName: 'Choa Chu Kang', line: 'BP', color: '#688e26' }
    ]
  },
  {
    code: '10018',
    roadName: 'Spooner Rd',
    description: 'Kampong Bahru Ter',
    latitude: 1.2778,
    longitude: 103.8340,
    services: ['12', '190'],
    mrtConnections: [
      { stationCode: 'EW16', stationName: 'Outram Park', line: 'EW', color: '#009640' },
      { stationCode: 'NE3', stationName: 'Outram Park', line: 'NE', color: '#8f1a95' },
      { stationCode: 'TE17', stationName: 'Outram Park', line: 'TE', color: '#9d5b25' }
    ]
  },
  {
    code: '07011',
    roadName: 'Bukit Timah Rd',
    description: 'Little India Stn Exit A',
    latitude: 1.3069,
    longitude: 103.8491,
    services: ['65', '857'],
    mrtConnections: [
      { stationCode: 'NE7', stationName: 'Little India', line: 'NE', color: '#8f1a95' },
      { stationCode: 'DT12', stationName: 'Little India', line: 'DT', color: '#005ec4' }
    ]
  },
  {
    code: '80051',
    roadName: 'New Upper Changi Rd',
    description: 'Bedok Stn Exit A',
    latitude: 1.3242,
    longitude: 103.9298,
    services: ['7'],
    mrtConnections: [
      { stationCode: 'EW5', stationName: 'Bedok', line: 'EW', color: '#009640' }
    ]
  },
  {
    code: '17179',
    roadName: 'Commonwealth Ave West',
    description: 'Clementi Stn Exit A',
    latitude: 1.3151,
    longitude: 103.7652,
    services: ['7', '147'],
    mrtConnections: [
      { stationCode: 'EW23', stationName: 'Clementi', line: 'EW', color: '#009640' }
    ]
  }
];

export const SINGAPORE_BUS_ROUTES: Record<string, BusRouteInfo> = {
  '190': {
    serviceNo: '190',
    direction: 1,
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    operator: 'SMRT',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '4-6 mins',
    frequencyOffPeak: '7-11 mins',
    stops: [
      { stopCode: '44009', stopSeq: 1, distanceKm: 0.0, roadName: 'Choa Chu Kang Loop', description: 'Choa Chu Kang Int', latitude: 1.3853, longitude: 103.7444 },
      { stopCode: '09022', stopSeq: 12, distanceKm: 14.2, roadName: 'Orchard Rd', description: 'Orchard Stn / Lucky Plaza', latitude: 1.3040, longitude: 103.8335 },
      { stopCode: '09048', stopSeq: 14, distanceKm: 15.1, roadName: 'Somerset Rd', description: 'Opp Somerset Stn', latitude: 1.3006, longitude: 103.8385 },
      { stopCode: '08057', stopSeq: 16, distanceKm: 16.0, roadName: 'Orchard Rd', description: 'Dhoby Ghaut Stn', latitude: 1.2991, longitude: 103.8458 },
      { stopCode: '04111', stopSeq: 18, distanceKm: 17.1, roadName: 'North Bridge Rd', description: 'City Hall Stn Exit B', latitude: 1.2932, longitude: 103.8522 },
      { stopCode: '04239', stopSeq: 20, distanceKm: 18.2, roadName: 'Eu Tong Sen St', description: 'Clarke Quay Stn Exit E', latitude: 1.2885, longitude: 103.8465 },
      { stopCode: '05013', stopSeq: 22, distanceKm: 19.0, roadName: 'Eu Tong Sen St', description: 'Chinatown Stn Exit C', latitude: 1.2842, longitude: 103.8436 },
      { stopCode: '10018', stopSeq: 26, distanceKm: 20.8, roadName: 'Spooner Rd', description: 'Kampong Bahru Ter', latitude: 1.2778, longitude: 103.8340 }
    ],
    polyline: [
      [1.3853, 103.7444],
      [1.3780, 103.7620],
      [1.3650, 103.7720],
      [1.3400, 103.8050],
      [1.3190, 103.8240],
      [1.3040, 103.8335],
      [1.3006, 103.8385],
      [1.2991, 103.8458],
      [1.2932, 103.8522],
      [1.2885, 103.8465],
      [1.2842, 103.8436],
      [1.2778, 103.8340]
    ]
  },
  '65': {
    serviceNo: '65',
    direction: 1,
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    operator: 'SBST',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:45',
    frequencyPeak: '5-8 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '84009', stopSeq: 1, distanceKm: 0.0, roadName: 'Tampines Central 1', description: 'Tampines Int', latitude: 1.3541, longitude: 103.9431 },
      { stopCode: '07011', stopSeq: 18, distanceKm: 13.5, roadName: 'Bukit Timah Rd', description: 'Little India Stn Exit A', latitude: 1.3069, longitude: 103.8491 },
      { stopCode: '08057', stopSeq: 20, distanceKm: 14.8, roadName: 'Orchard Rd', description: 'Dhoby Ghaut Stn', latitude: 1.2991, longitude: 103.8458 },
      { stopCode: '09048', stopSeq: 22, distanceKm: 15.6, roadName: 'Somerset Rd', description: 'Opp Somerset Stn', latitude: 1.3006, longitude: 103.8385 },
      { stopCode: '09022', stopSeq: 24, distanceKm: 16.5, roadName: 'Orchard Rd', description: 'Orchard Stn / Lucky Plaza', latitude: 1.3040, longitude: 103.8335 },
      { stopCode: '14141', stopSeq: 33, distanceKm: 21.6, roadName: 'Telok Blangah Rd', description: 'HarbourFront Stn / VivoCity', latitude: 1.2652, longitude: 103.8218 }
    ],
    polyline: [
      [1.3541, 103.9431],
      [1.3400, 103.9180],
      [1.3320, 103.8820],
      [1.3150, 103.8600],
      [1.3069, 103.8491],
      [1.2991, 103.8458],
      [1.3006, 103.8385],
      [1.3040, 103.8335],
      [1.2910, 103.8290],
      [1.2750, 103.8250],
      [1.2652, 103.8218]
    ]
  },
  '143': {
    serviceNo: '143',
    direction: 1,
    origin: 'Toa Payoh Int',
    destination: 'Jurong East Int',
    operator: 'TTS',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '6-9 mins',
    frequencyOffPeak: '9-14 mins',
    stops: [
      { stopCode: '52009', stopSeq: 1, distanceKm: 0.0, roadName: 'Lorong 6 Toa Payoh', description: 'Toa Payoh Int', latitude: 1.3328, longitude: 103.8475 },
      { stopCode: '09022', stopSeq: 11, distanceKm: 5.8, roadName: 'Orchard Rd', description: 'Orchard Stn / Lucky Plaza', latitude: 1.3040, longitude: 103.8335 },
      { stopCode: '09048', stopSeq: 13, distanceKm: 6.6, roadName: 'Somerset Rd', description: 'Opp Somerset Stn', latitude: 1.3006, longitude: 103.8385 },
      { stopCode: '04239', stopSeq: 17, distanceKm: 8.8, roadName: 'Eu Tong Sen St', description: 'Clarke Quay Stn Exit E', latitude: 1.2885, longitude: 103.8465 },
      { stopCode: '05013', stopSeq: 19, distanceKm: 9.6, roadName: 'Eu Tong Sen St', description: 'Chinatown Stn Exit C', latitude: 1.2842, longitude: 103.8436 },
      { stopCode: '14141', stopSeq: 26, distanceKm: 13.9, roadName: 'Telok Blangah Rd', description: 'HarbourFront Stn / VivoCity', latitude: 1.2652, longitude: 103.8218 },
      { stopCode: '28009', stopSeq: 42, distanceKm: 25.1, roadName: 'Jurong Gateway Rd', description: 'Jurong East Int', latitude: 1.3331, longitude: 103.7423 }
    ],
    polyline: [
      [1.3328, 103.8475],
      [1.3190, 103.8410],
      [1.3040, 103.8335],
      [1.3006, 103.8385],
      [1.2885, 103.8465],
      [1.2842, 103.8436],
      [1.2720, 103.8320],
      [1.2652, 103.8218],
      [1.2780, 103.7850],
      [1.2980, 103.7640],
      [1.3331, 103.7423]
    ]
  },
  '36': {
    serviceNo: '36',
    direction: 1,
    origin: 'Changi Airport PTB2',
    destination: 'Tomlinson Rd (Loop)',
    operator: 'GAS',
    category: 'Trunk',
    firstBus: '06:00',
    lastBus: '23:58',
    frequencyPeak: '7-10 mins',
    frequencyOffPeak: '10-15 mins',
    stops: [
      { stopCode: '95129', stopSeq: 1, distanceKm: 0.0, roadName: 'Airport Blvd', description: 'Changi Airport PTB2', latitude: 1.3551, longitude: 103.9886 },
      { stopCode: '02049', stopSeq: 16, distanceKm: 18.2, roadName: 'Temasek Blvd', description: 'Suntec Convention Ctr', latitude: 1.2938, longitude: 103.8584 },
      { stopCode: '03511', stopSeq: 18, distanceKm: 20.1, roadName: 'Bayfront Ave', description: 'Marina Bay Sands MICE', latitude: 1.2838, longitude: 103.8589 },
      { stopCode: '03211', stopSeq: 20, distanceKm: 22.0, roadName: 'Bras Basah Rd', description: 'Raffles Hotel', latitude: 1.2951, longitude: 103.8545 },
      { stopCode: '08057', stopSeq: 22, distanceKm: 23.1, roadName: 'Orchard Rd', description: 'Dhoby Ghaut Stn', latitude: 1.2991, longitude: 103.8458 },
      { stopCode: '09048', stopSeq: 24, distanceKm: 24.0, roadName: 'Somerset Rd', description: 'Opp Somerset Stn', latitude: 1.3006, longitude: 103.8385 },
      { stopCode: '09022', stopSeq: 26, distanceKm: 25.0, roadName: 'Orchard Rd', description: 'Orchard Stn / Lucky Plaza', latitude: 1.3040, longitude: 103.8335 }
    ],
    polyline: [
      [1.3551, 103.9886],
      [1.3280, 103.9350],
      [1.3030, 103.8920],
      [1.2938, 103.8584],
      [1.2838, 103.8589],
      [1.2951, 103.8545],
      [1.2991, 103.8458],
      [1.3006, 103.8385],
      [1.3040, 103.8335]
    ]
  },
  '857': {
    serviceNo: '857',
    direction: 1,
    origin: 'Yishun Int',
    destination: 'Suntec City (Loop)',
    operator: 'TTS',
    category: 'Express',
    firstBus: '05:45',
    lastBus: '23:30',
    frequencyPeak: '5-8 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '54009', stopSeq: 12, distanceKm: 9.8, roadName: 'Bishan Place', description: 'Bishan Int', latitude: 1.3504, longitude: 103.8488 },
      { stopCode: '07011', stopSeq: 17, distanceKm: 14.5, roadName: 'Bukit Timah Rd', description: 'Little India Stn Exit A', latitude: 1.3069, longitude: 103.8491 },
      { stopCode: '01012', stopSeq: 19, distanceKm: 15.9, roadName: 'Victoria St', description: 'Hotel Grand Pacific', latitude: 1.2974, longitude: 103.8528 },
      { stopCode: '04111', stopSeq: 20, distanceKm: 16.5, roadName: 'North Bridge Rd', description: 'City Hall Stn Exit B', latitude: 1.2932, longitude: 103.8522 },
      { stopCode: '02049', stopSeq: 22, distanceKm: 17.6, roadName: 'Temasek Blvd', description: 'Suntec Convention Ctr', latitude: 1.2938, longitude: 103.8584 }
    ],
    polyline: [
      [1.4300, 103.8350],
      [1.3850, 103.8500],
      [1.3504, 103.8488],
      [1.3250, 103.8540],
      [1.3069, 103.8491],
      [1.2974, 103.8528],
      [1.2932, 103.8522],
      [1.2938, 103.8584]
    ]
  },
  '12': {
    serviceNo: '12',
    direction: 1,
    origin: 'Pasir Ris Int',
    destination: 'Kampong Bahru Ter',
    operator: 'GAS',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:45',
    frequencyPeak: '6-9 mins',
    frequencyOffPeak: '9-13 mins',
    stops: [
      { stopCode: '84009', stopSeq: 5, distanceKm: 3.2, roadName: 'Tampines Central 1', description: 'Tampines Int', latitude: 1.3541, longitude: 103.9431 },
      { stopCode: '01112', stopSeq: 24, distanceKm: 18.0, roadName: 'Victoria St', description: 'Bugis Stn Exit A', latitude: 1.3008, longitude: 103.8561 },
      { stopCode: '01012', stopSeq: 25, distanceKm: 18.6, roadName: 'Victoria St', description: 'Hotel Grand Pacific', latitude: 1.2974, longitude: 103.8528 },
      { stopCode: '04111', stopSeq: 27, distanceKm: 19.4, roadName: 'North Bridge Rd', description: 'City Hall Stn Exit B', latitude: 1.2932, longitude: 103.8522 },
      { stopCode: '04239', stopSeq: 29, distanceKm: 20.3, roadName: 'Eu Tong Sen St', description: 'Clarke Quay Stn Exit E', latitude: 1.2885, longitude: 103.8465 },
      { stopCode: '05013', stopSeq: 31, distanceKm: 21.0, roadName: 'Eu Tong Sen St', description: 'Chinatown Stn Exit C', latitude: 1.2842, longitude: 103.8436 },
      { stopCode: '10018', stopSeq: 35, distanceKm: 22.8, roadName: 'Spooner Rd', description: 'Kampong Bahru Ter', latitude: 1.2778, longitude: 103.8340 }
    ],
    polyline: [
      [1.3720, 103.9490],
      [1.3541, 103.9431],
      [1.3340, 103.9100],
      [1.3120, 103.8760],
      [1.3008, 103.8561],
      [1.2974, 103.8528],
      [1.2932, 103.8522],
      [1.2885, 103.8465],
      [1.2842, 103.8436],
      [1.2778, 103.8340]
    ]
  },
  '7': {
    serviceNo: '7',
    direction: 1,
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    operator: 'SBST',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:50',
    frequencyPeak: '5-7 mins',
    frequencyOffPeak: '8-11 mins',
    stops: [
      { stopCode: '80051', stopSeq: 1, distanceKm: 0.0, roadName: 'New Upper Changi Rd', description: 'Bedok Stn Exit A', latitude: 1.3242, longitude: 103.9298 },
      { stopCode: '01112', stopSeq: 16, distanceKm: 11.2, roadName: 'Victoria St', description: 'Bugis Stn Exit A', latitude: 1.3008, longitude: 103.8561 },
      { stopCode: '01012', stopSeq: 17, distanceKm: 11.8, roadName: 'Victoria St', description: 'Hotel Grand Pacific', latitude: 1.2974, longitude: 103.8528 },
      { stopCode: '08057', stopSeq: 19, distanceKm: 12.9, roadName: 'Orchard Rd', description: 'Dhoby Ghaut Stn', latitude: 1.2991, longitude: 103.8458 },
      { stopCode: '09048', stopSeq: 21, distanceKm: 13.8, roadName: 'Somerset Rd', description: 'Opp Somerset Stn', latitude: 1.3006, longitude: 103.8385 },
      { stopCode: '09022', stopSeq: 23, distanceKm: 14.7, roadName: 'Orchard Rd', description: 'Orchard Stn / Lucky Plaza', latitude: 1.3040, longitude: 103.8335 },
      { stopCode: '17179', stopSeq: 38, distanceKm: 23.4, roadName: 'Commonwealth Ave West', description: 'Clementi Stn Exit A', latitude: 1.3151, longitude: 103.7652 }
    ],
    polyline: [
      [1.3242, 103.9298],
      [1.3150, 103.8960],
      [1.3008, 103.8561],
      [1.2974, 103.8528],
      [1.2991, 103.8458],
      [1.3006, 103.8385],
      [1.3040, 103.8335],
      [1.3060, 103.7980],
      [1.3151, 103.7652]
    ]
  },
  '960': {
    serviceNo: '960',
    direction: 1,
    origin: 'Woodlands Int',
    destination: 'Marina Centre Ter',
    operator: 'SMRT',
    category: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '5-8 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '46009', stopSeq: 1, distanceKm: 0.0, roadName: 'Woodlands Sq', description: 'Woodlands Int', latitude: 1.4368, longitude: 103.7865 },
      { stopCode: '01112', stopSeq: 26, distanceKm: 22.1, roadName: 'Victoria St', description: 'Bugis Stn Exit A', latitude: 1.3008, longitude: 103.8561 },
      { stopCode: '03511', stopSeq: 30, distanceKm: 24.5, roadName: 'Bayfront Ave', description: 'Marina Bay Sands MICE', latitude: 1.2838, longitude: 103.8589 }
    ],
    polyline: [
      [1.4368, 103.7865],
      [1.3850, 103.7750],
      [1.3350, 103.8150],
      [1.3008, 103.8561],
      [1.2838, 103.8589]
    ]
  }
};

export const SINGAPORE_POPULAR_DISTRICTS = [
  { name: 'City Hall & Bugis', lat: 1.2974, lng: 103.8528, stopCode: '04111' },
  { name: 'Orchard Road Shopping', lat: 1.3040, lng: 103.8335, stopCode: '09022' },
  { name: 'Dhoby Ghaut Interchange', lat: 1.2991, lng: 103.8458, stopCode: '08057' },
  { name: 'Marina Bay Sands', lat: 1.2838, lng: 103.8589, stopCode: '03511' },
  { name: 'Chinatown & Clarke Quay', lat: 1.2842, lng: 103.8436, stopCode: '05013' },
  { name: 'HarbourFront & VivoCity', lat: 1.2652, lng: 103.8218, stopCode: '14141' },
  { name: 'Jurong East Hub', lat: 1.3331, lng: 103.7423, stopCode: '28009' },
  { name: 'Tampines Regional Hub', lat: 1.3541, lng: 103.9431, stopCode: '84009' },
  { name: 'Changi Airport', lat: 1.3551, lng: 103.9886, stopCode: '95129' },
  { name: 'Woodlands Hub', lat: 1.4368, lng: 103.7865, stopCode: '46009' }
];
