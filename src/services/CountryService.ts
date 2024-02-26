import dayjs from "dayjs";

import { TravelPeriod } from "src/types";

export class CountryService {
  static calculateTravelPeriodScore(
    travelPeriod: TravelPeriod,
    bestMonths: number[]
  ): number {
    const periodStart = dayjs(travelPeriod.start);
    const periodEnd = dayjs(travelPeriod.end);

    const totalDays = periodEnd.diff(periodStart, "day") + 1;

    let intersectionDays = 0;

    for (let i = 0; i < totalDays; i++) {
      const currentDay = periodStart.add(i, "day");
      const currentMonth = currentDay.month() + 1; // dayjs months are 0-indexed

      if (bestMonths.includes(currentMonth)) {
        intersectionDays++;
      }
    }

    const intersectionScore = intersectionDays / totalDays;
    return intersectionScore;
  }

  static calculateProximityScore() {}
  // calculateProximityScore
  // calculateSafetyScore
  // calculateAffordabilityScore - NOT NEEDED. Will replace with the following logic:
  // Having data for three expense levels, if the total expense for the trip period is over the cheapest expense level - filter the country out of the list

  getOverallCountryScore() {}

  // selectCountriesForTrip
}
