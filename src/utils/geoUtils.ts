import { WorkLocation } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth
 * using the Haversine formula in meters.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Finds the closest work location and checks if user is within the geofence radius.
 */
export function evaluateGeofence(
  userLat: number,
  userLng: number,
  locations: WorkLocation[],
  targetLocationId?: string
): {
  closestLocation: WorkLocation;
  distanceMeters: number;
  isWithinGeofence: boolean;
  accuracyMargin: number;
} {
  if (locations.length === 0) {
    throw new Error('No work locations configured');
  }

  // If a specific assigned location is targeted, evaluate against it
  let targetLocation = targetLocationId
    ? locations.find((l) => l.id === targetLocationId)
    : undefined;

  if (!targetLocation) {
    // Find closest
    let minDistance = Infinity;
    let closest = locations[0];

    for (const loc of locations) {
      const dist = calculateHaversineDistanceMeters(userLat, userLng, loc.latitude, loc.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    }
    targetLocation = closest;
  }

  const distance = calculateHaversineDistanceMeters(
    userLat,
    userLng,
    targetLocation.latitude,
    targetLocation.longitude
  );

  const isWithin = distance <= targetLocation.radiusMeters;

  return {
    closestLocation: targetLocation,
    distanceMeters: distance,
    isWithinGeofence: isWithin,
    accuracyMargin: Math.max(0, distance - targetLocation.radiusMeters),
  };
}

/**
 * Formats coordinates for clean display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}
