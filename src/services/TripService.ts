import dayjs from "dayjs";

import { BudgetType, Location, TravelPeriod, Weights } from "src/types";
import { PlacesService } from "./PlacesService";
import { Country, CountryModel } from "src/models/country";
import { CountryService } from "./CountryService";
import { GeospatialService } from "./GeospatialService";

export class TripService {
  // https://www.rome2rio.com/labs/2018-global-flight-price-ranking/
  // TODO: This is old data, would be nice to update it
  static FLIGHT_PRICE_PER_KM = 0.17; // USD

  static getTripBudgetWithoutTransportation(
    budget: number,
    period: TravelPeriod,
    distance: number
  ) {
    const approximateBothWaysFlightCostForDistance =
      this.getApproximateBothWaysFlightCostForDistance(distance);

    return (
      (budget - approximateBothWaysFlightCostForDistance) /
      this.getNumberOfTripDays(period)
    );
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
    numberOfPeople: number,
    totalDailyBudgetPerPerson: number
  ) {
    let budgetType: BudgetType = 1;

    for (let i = 1; i <= 3; i++) {
      if (typeof dailyExpenses[i as BudgetType] === "number") {
        const userCanAffordTheCountryBudget =
          totalDailyBudgetPerPerson / numberOfPeople >=
          dailyExpenses[i as BudgetType]!;

        if (userCanAffordTheCountryBudget) budgetType = i as BudgetType;
      }
    }

    return budgetType;
  }

  private static getApproximateBothWaysFlightCostForDistance = (
    distance: number
  ) => {
    return Math.floor(distance * this.FLIGHT_PRICE_PER_KM * 2);
  };

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

    const filteredCountriesData = countries
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
          const countryCentralLocation =
            GeospatialService.dbCoordinatesToLocation(
              country.location.coordinates as [number, number]
            );

          const distance = GeospatialService.calculateHaversineDistance(
            startingPoint,
            countryCentralLocation
          );

          const tripBudgetWithoutTransportation =
            this.getTripBudgetWithoutTransportation(
              budget,
              travelPeriod,
              distance
            );

          const bestAffordedBudgetType = this.getBestAffordedBudgetType(
            dailyExpenses,
            numberOfPeople,
            tripBudgetWithoutTransportation
          );

          const score = CountryService.getOverallCountryScore(
            country,
            travelPeriod,
            startingPoint,
            weights
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
      // Filter out countries that are not in the user's budget
      .filter((countryData) => {
        const numberOfTripDays = this.getNumberOfTripDays(travelPeriod);

        const approximateBothWaysFlightCostForDistance =
          this.getApproximateBothWaysFlightCostForDistance(
            countryData.distance
          );

        const dailyBudgetWithoutTransportationForAllPeople = Math.floor(
          (budget - approximateBothWaysFlightCostForDistance * numberOfPeople) /
            numberOfTripDays
        );

        const dailyExpensesForSelectedBudgetTypeForAllPeople =
          countryData.dailyExpenses[countryData.selectedBudgetType]! *
          numberOfPeople;

        // Compare the dailyBudgetWithoutTransportationForAllPeople to country's lowest expenses for all the people in the trip
        return (
          dailyBudgetWithoutTransportationForAllPeople >=
          dailyExpensesForSelectedBudgetTypeForAllPeople
        );
      });

    const finalCountries: Partial<
      Record<
        BudgetType,
        (typeof filteredCountriesData)[number] & {
          isNotExpectedCountry?: boolean;
        }
      >
    > = {};

    // Furthest country of budget type 1 with highest score
    const bestLongDistanceCountry = filteredCountriesData
      .filter((countryData) => countryData.selectedBudgetType === 1)
      .sort((a, b) => {
        const distanceOrder = b.distance - a.distance;
        const scoreOrder = b.score - a.score;

        return distanceOrder || scoreOrder;
      })[0];

    if (bestLongDistanceCountry) finalCountries[1] = bestLongDistanceCountry;

    // Country of budget type 2 with highest score (maybe also check for a mid-distance? I don't know)
    const bestMidRangeCountry = filteredCountriesData
      .filter((countryData) => countryData.selectedBudgetType === 2)
      .sort((a, b) => b.score - a.score)[0];

    if (bestMidRangeCountry) finalCountries[2] = bestMidRangeCountry;

    // Country of budget type 3 with highest score
    const bestLuxuryCountry = filteredCountriesData
      .filter((countryData) => countryData.selectedBudgetType === 3)
      .sort((a, b) => b.score - a.score)[0];

    if (bestLuxuryCountry) finalCountries[3] = bestLuxuryCountry;

    // If we don't have all three countries at this point, just go and pick the next best countries
    let assignedCountryCount = 0;

    console.log("assignedCountryCount", assignedCountryCount);
    console.log(
      "filteredCountriesData.length - 2",
      filteredCountriesData.length - 2
    );
    while (
      Object.keys(finalCountries).length < 3 &&
      assignedCountryCount < filteredCountriesData.length - 2 // We might have a max of two countries missing from finalCountries
    ) {
      const selectedCountryCodes = Object.values(finalCountries).map(
        (countryData) => countryData.country.alpha2
      );

      const missingBudgetType = !finalCountries[1]
        ? 1
        : !finalCountries[2]
        ? 2
        : 3;

      // Avoid having the same country two times
      if (
        !selectedCountryCodes.includes(
          filteredCountriesData[assignedCountryCount].country.alpha2
        )
      ) {
        finalCountries[missingBudgetType] = {
          ...filteredCountriesData[assignedCountryCount],
          isNotExpectedCountry: true,
        };
      }
      assignedCountryCount++;
    }

    return finalCountries; // TODO: change with best country for each budgetType
  }
}
