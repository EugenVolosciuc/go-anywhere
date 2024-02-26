import dayjs from "dayjs";
import { Country } from "src/models/country";

import { Location, TravelPeriod } from "src/types";
import { GeospatialService } from "./GeospatialService";
import { StatisticsService } from "./StatisticsService";

export class CountryService {
  // For enormous countries (Russia, Canada, China, United States, Brazil, Australia) make the score not as aggresive,
  // because these countries' central location is not the best way to calculate the proximity score
  // Because of this, subtract a small amount from the normalized score to compensate for their big area.
  // https://www.worldometers.info/geography/largest-countries-in-the-world/
  static CountryAreaCompensation: Record<string, number> = {
    RU: 0.25,
    CA: 0.14,
    CN: 0.14,
    US: 0.13,
    BR: 0.12,
    AU: 0.1,
  };

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

    const distance = GeospatialService.calculateHaversineDistance(
      startingPoint,
      countryCentralLocation
    );

    const normalizedScore = StatisticsService.minMaxNormalization(
      distance,
      0,
      GeospatialService.LONGEST_DISTANCE_ON_EARTH
    );

    const scoreCompensation = this.CountryAreaCompensation[country.alpha2] || 0;

    return 1 - normalizedScore + scoreCompensation;
  }
  // calculateProximityScore
  // calculateSafetyScore
  // calculateAffordabilityScore - NOT NEEDED. Will replace with the following logic:
  // Having data for three expense levels, if the total expense for the trip period is over the cheapest expense level - filter the country out of the list

  getOverallCountryScore() {}

  // selectCountriesForTrip
}
