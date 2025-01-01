export type Scooter = {
    id: string;
    batteryLevel: number;
    latitude: number;
    longitude: number;
    status: string;
    city: string;
    createdAt: string;
    updatedAt: string;
  };

export type PolygonPoint = {
    lat: number;
    lng: number;
  };

export type SpeedZone = {
    id: string;
    speedLimit: number;
};

export type City = {
    id: string;
    latitude: number;
    longitude: number;
    city: string;
    createdAt: string;
    updatedAt: string;
    name: string;
};

export type Zone = {
    id: string;
    polygon: PolygonPoint[];
    type: 'parking' | 'charging' | 'speed';
    speedZone?: SpeedZone | null;
    bikes?: Scooter[];
    name?: string;
    city?: City
};
