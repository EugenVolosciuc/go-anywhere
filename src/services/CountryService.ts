import dayjs from "dayjs";
import { Country } from "src/models/country";

import { Location, TravelPeriod } from "src/types";
import { GeospatialService } from "./GeospatialService";
import { StatisticsService } from "./StatisticsService";

export class CountryService {
  static calculateTravelPeriodScore(
    country: Country,
    travelPeriod: TravelPeriod
  ): number {
    const periodStart = dayjs(travelPeriod.start);
    const periodEnd = dayjs(travelPeriod.end);

    const totalDays = periodEnd.diff(periodStart, "day") + 1;

    let intersectionDays = 0;

    for (let i = 0; i < totalDays; i++) {
      const currentDay = periodStart.add(i, "day");
      const currentMonth = currentDay.month() + 1; // dayjs months are 0-indexed

      if (country.bestMonthsToVisit.includes(currentMonth)) {
        intersectionDays++;
      }
    }

    const intersectionScore = intersectionDays / totalDays;
    return intersectionScore;
  }

  static calculateProximityScore(country: Country, startingPoint: Location) {
    const countryCentralLocation = GeospatialService.dbCoordinatesToLocation(
      country.location.coordinates as [number, number]
    );

    console.log("countryCentralLocation", countryCentralLocation);

    const distance = GeospatialService.calculateHaversineDistance(
      startingPoint,
      countryCentralLocation
    );

    console.log("distance", distance);

    const normalizedScore = StatisticsService.minMaxNormalization(
      distance,
      0,
      GeospatialService.LONGEST_DISTANCE_ON_EARTH
    );

    return 1 - normalizedScore;
  }
  // calculateProximityScore
  // calculateSafetyScore
  // calculateAffordabilityScore - NOT NEEDED. Will replace with the following logic:
  // Having data for three expense levels, if the total expense for the trip period is over the cheapest expense level - filter the country out of the list

  getOverallCountryScore() {}

  // selectCountriesForTrip
}
