import { Location } from "types";

export class GeospatialService {
  static EARTH_RADIUS_KM = 6371 as const;
  static LONGEST_DISTANCE_ON_EARTH = 20_010 as const;
  /**
   * The Earth is not flat. Use Haversine formula for accurate geospatial distance calculation.
   */
  static calculateHaversineDistance = (
    coord1: Location,
    coord2: Location
  ): number => {
    const degToRad = (degrees: number): number => degrees * (Math.PI / 180);

    const dLat = degToRad(coord2.lat - coord1.lat);
    const dLon = degToRad(coord2.long - coord1.long);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(coord1.lat)) *
        Math.cos(degToRad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = this.EARTH_RADIUS_KM * c; // Distance in kilometers

    return distance;
  };

  static dbCoordinatesToLocation([long, lat]: [number, number]): Location {
    return { lat, long };
  }
}
