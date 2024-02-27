import dayjs from "dayjs";

import { BudgetType, Location, TravelPeriod, Weights } from "src/types";
import { PlacesService } from "./PlacesService";
import { Country, CountryModel } from "src/models/country";
import { CountryService } from "./CountryService";
import { GeospatialService } from "./GeospatialService";

export class TripService {
  // TODO: Instead of this, we should have a map of approximate costs of flight from region to region (continent to continent?)
  // With the current implementation, we are getting African countries as variants for trips from Romania with a 1000$ budget with 3 people.
  // 30% is clearly not enough in this case for flight tickets.
  static BUDGET_ALLOCATED_FOR_TRANSPORTATION = 0.3 as const; // 30%

  static getDailyTripBudgetPerPerson(budget: number, period: TravelPeriod) {
    return budget / this.getNumberOfTripDays(period);
  }

  static getNumberOfTripDays(period: TravelPeriod) {
    const startDate = dayjs(period.start);
    const endDate = dayjs(period.end);

    const daysDifference = endDate.diff(startDate, "day");

    return daysDifference;
  }

  private static getBestAffordedBudgetType(
    dailyExpenses: NonNullable<
      ReturnType<typeof CountryService.getDailyCountryBudget>
    >,
    dailyTripBudgetPerPerson: number
  ) {
    let budgetType: BudgetType = 1;

    for (let i = 1; i <= 3; i++) {
      if (typeof dailyExpenses[i as BudgetType] === "number") {
        const userCanAffordTheCountryBudget =
          dailyTripBudgetPerPerson >= dailyExpenses[i as BudgetType]!;

        if (userCanAffordTheCountryBudget) budgetType = i as BudgetType;
      }
    }

    return budgetType;
  }

  static async selectCountriesForTrip(
    travelPeriod: TravelPeriod,
    startingPoint: Location,
    budget: number,
    numberOfPeople: number,
    weights: Record<Weights, number>,
    excludedCountries: string[] = []
  ) {
    const startingPointCountry = await PlacesService.findCountryByLocation(
      startingPoint
    );
    const countries = await CountryModel.where("alpha2").nin(
      Array.from(
        new Set([
          ...CountryService.EXCLUDED_COUNTRY_ALPHA_2_IDS,
          excludedCountries,
          startingPointCountry.alpha2, // filter out starting point country
        ])
      )
    );
    const dailyTripBudgetPerPerson = TripService.getDailyTripBudgetPerPerson(
      budget,
      travelPeriod
    );

    const sortedCountries = countries
      .reduce<
        {
          country: Country;
          score: number;
          dailyExpenses: NonNullable<
            ReturnType<typeof CountryService.getDailyCountryBudget>
          >;
          selectedBudgetType: BudgetType;
          distance: number;
        }[]
      >((data, country) => {
        const dailyExpenses = CountryService.getDailyCountryBudget(
          country.toObject()
        );

        if (dailyExpenses) {
          const bestAffordedBudgetType = this.getBestAffordedBudgetType(
            dailyExpenses,
            dailyTripBudgetPerPerson
          );

          const score = CountryService.getOverallCountryScore(
            country,
            travelPeriod,
            startingPoint,
            weights
          );

          const countryCentralLocation =
            GeospatialService.dbCoordinatesToLocation(
              country.location.coordinates as [number, number]
            );

          const distance = GeospatialService.calculateHaversineDistance(
            startingPoint,
            countryCentralLocation
          );

          data.push({
            country: country.toObject(),
            score,
            dailyExpenses,
            selectedBudgetType: bestAffordedBudgetType,
            distance,
          });
        }

        return data;
      }, [])
      .filter((countryAndScore) => {
        // We might not have the info about the on-a-budget expenses, so at least get one of them
        const lowestDailyCountryExpenses =
          countryAndScore.dailyExpenses[1] ||
          countryAndScore.dailyExpenses[2] ||
          countryAndScore.dailyExpenses[3]!;

        // Because we can't check for flight prices at this stage, allocate a portion of the budget to flights/transportation
        const lowestDailyCountryExpensesWithoutTransportation =
          lowestDailyCountryExpenses /
          (1 - TripService.BUDGET_ALLOCATED_FOR_TRANSPORTATION);

        return (
          dailyTripBudgetPerPerson >=
          lowestDailyCountryExpensesWithoutTransportation
        );
      })
      .sort((a, b) => b.score - a.score)
      .map((countryData) => ({
        country: countryData.country.name,
        score: countryData.score,
        distance: countryData.distance,
        bestMonths: countryData.country.bestMonthsToVisit,
        budgetType: countryData.selectedBudgetType,
      }));
    // TODO: get the best country for each budgetType
    // What is the best country?
    // The best country for the budget type is the one with the highest overall score of this type and furthest distance
    // The best country for the mid-range type is the one with the highest overall score of this type and a mid distance
    // The best country for the luxury type is the one with the highest overall score

    return sortedCountries; // TODO: change with best country for each budgetType
  }
}
