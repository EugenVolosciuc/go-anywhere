import dayjs from "dayjs";

import { Country } from "models/country";
import { BudgetType, Location, TravelPeriod, Weights } from "types";
import { GeospatialService } from "./GeospatialService";
import { StatisticsService } from "./StatisticsService";

// The scoring scale we use here is from 0 to 1, 0 being worst and 1 being best
export class CountryService {
  // Penalty for missing data (set to 15% of the maximum criterion score)
  private static MISSING_DATA_PENALTY_SCORE = 0.15;

  // For enormous countries (Russia, Canada, China, United States, Brazil, Australia) make the score not as aggresive,
  // because these countries' central location is not the best way to calculate the proximity score
  // Because of this, subtract a small amount from the normalized score to compensate for their big area.
  // https://www.worldometers.info/geography/largest-countries-in-the-world/
  private static CountryAreaCompensation: Record<string, number> = {
    RU: 0.25,
    CA: 0.14,
    CN: 0.14,
    US: 0.13,
    BR: 0.12,
    AU: 0.1,
  };

  // TODO: Move this to the database
  // Iran, Iraq, Libya, North Korea, Syria, Cuba, Vatican, Ukraine
  static EXCLUDED_COUNTRY_ALPHA_2_IDS = [
    "IR",
    "IQ",
    "LY",
    "KP",
    "SY",
    "CU",
    "VA",
    "UA",
  ];

  private static calculateTravelPeriodScore(
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

  private static calculateProximityScore(
    country: Country,
    startingPoint: Location
  ) {
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

    // Invert scale
    return 1 - normalizedScore + scoreCompensation;
  }

  private static changeSafetyIndexScale(safetyIndex: number): number {
    // Invert the scale (higher safety -> lower score)
    const invertedSafety = 6 - safetyIndex;
    // Normalize to the 0-1 scale
    return invertedSafety / 5;
  }

  private static calculateSafetyScore(country: Country) {
    // We're using the GPI Index (https://www.visionofhumanity.org/maps/#/), which is from 1 to 5, from best to worst
    const safetyScore =
      typeof country.indexes?.safetyIndex === "string"
        ? StatisticsService.minMaxNormalization(
            this.changeSafetyIndexScale(
              parseFloat(country.indexes.safetyIndex)
            ),
            1,
            5
          )
        : this.MISSING_DATA_PENALTY_SCORE;

    return safetyScore;
  }

  // We are using normalized weights, meaning that the total of all weights must be equal to 1
  private static checkWeights(weights: Record<Weights, number>) {
    const weightsSum = Object.values(weights).reduce((accumulator, weight) => {
      accumulator += weight;

      return accumulator;
    }, 0);

    // TODO: change error type?
    if (weightsSum !== 1) throw new Error("Weights sum needs to be one");
  }

  static getOverallCountryScore(
    country: Country,
    travelPeriod: TravelPeriod,
    startingPoint: Location,
    weights: Record<Weights, number>
  ) {
    this.checkWeights(weights);

    return (
      weights.proximity * this.calculateProximityScore(country, startingPoint) +
      weights.travelPeriod *
        this.calculateTravelPeriodScore(country, travelPeriod) +
      weights.safety * this.calculateSafetyScore(country)
    );
  }

  static getDailyCountryBudget(
    country: Country
  ): Partial<{ [key in BudgetType]: number }> | null {
    if (!country.travelExpenses) return null;

    return Object.entries(country.travelExpenses).reduce<
      Partial<{ [key in BudgetType]: number }>
    >((accumulator, [budgetType, expenses]) => {
      if (!expenses) return accumulator;

      let sum = 0;
      Object.values(expenses).forEach((expense) => {
        if (typeof expense === "number") sum += expense;
      });

      accumulator[parseInt(budgetType, 10) as BudgetType] = sum;

      return accumulator;
    }, {});
  }
}
