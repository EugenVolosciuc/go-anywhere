import { Elysia, t } from "elysia";
import { CountryModel } from "src/models/country";
import { AirportService } from "src/services/AirportService";
import { PlacesService } from "src/services/PlacesService";
import { CountryService } from "src/services/CountryService";

enum Currency {
  USD = "USD",
}

export const TravelController = (app: Elysia) => {
  app.get(
    "/travel",
    async ({ query }) => {
      const romania = await CountryModel.findOne({ alpha2: "RO" });

      if (!romania) return "Could not find Romania";

      const travelPeriodScore = CountryService.calculateTravelPeriodScore(
        romania,
        query.period
      );
      const proximityScore = CountryService.calculateProximityScore(
        romania,
        query.location
      );
      // const closestAirport = await AirportService.findClosestAirport({
      //   lat: query.location.lat,
      //   long: query.location.long,
      // });

      // const nearestCities = await PlacesService.findPlaces({
      //   filters: {
      //     location: { lat: query.location.lat, long: query.location.long },
      //     minPopulation: 10000,
      //     radius: 100,
      //   },
      // });

      // What needs to be done here?
      // In the end, we need to return a list of trips
      // A trip is a list of locations and the period for each stay
      // We need to factor in the budget and the number of people
      // MVP #1:
      // - Choose a destination country
      //  - Pick a selection of countries based on the budget and proximity
      //    - Cost of living index - https://www.numbeo.com/cost-of-living/rankings_by_country.jsp (can be crawled)
      //    - Average daily expenses for travelers -  https://www.budgetyourtrip.com/japan (replace with any country, can be crawled)
      //    - Accommodation costs - Same as Average daily expenses for travelers
      //    - Local transportation costs - Same as Average daily expenses for travelers
      //    - Food and dining costs - Same as Average daily expenses for travelers
      // - Split the period into multiple locations inside the country

      // const countries = new CountryService().getRecommendedCountries(query.location, )

      return {
        travelPeriodScore,
        proximityScore,
        // closestAirport,
        // nearestCities,
      };
    },
    {
      query: t.Object({
        location: t.ObjectString({
          lat: t.Numeric(),
          long: t.Numeric(),
        }),
        budget: t.ObjectString({
          min: t.Optional(t.Numeric()), // NOTE: not putting in the equation for now
          max: t.Numeric(), // TODO: max can't be less than min
          currency: t.Enum(Currency, { default: Currency.USD }),
        }),
        period: t.ObjectString({
          start: t.Date(),
          end: t.Date(),
        }),
        numberOfPeople: t.Numeric(t.Integer()),
      }),
    }
  );

  return Promise.resolve(app);
};
