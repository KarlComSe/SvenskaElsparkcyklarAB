import * as turf from '@turf/turf';

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const from = turf.point([lon1, lat1]);
  const to = turf.point([lon2, lat2]);
  return turf.distance(from, to) * 1000;
}

export function positionInsidePolygon(
  lat: number,
  lon: number,
  polygon: { lat: number; lng: number }[],
): boolean {
  const point = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: [lon, lat],
    },
  };
  const poly = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [polygon.map((p) => [p.lng, p.lat])],
    },
  };
  return turf.booleanPointInPolygon(point, poly);
}
