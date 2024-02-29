import { Elysia, t } from "elysia";

import { TripService } from "services/TripService";
import * as schema from "controllers/schemas";

export const TravelController = (app: Elysia) => {
  app.get(
    "/trip-countries",
    async ({ query }) => {
      const countries = await TripService.selectCountriesForTrip(
        query.period,
        query.location,
        query.budget.max,
        query.numberOfPeople,
        { proximity: 0.4, safety: 0.25, travelPeriod: 0.35 }
      );

      return countries;
    },
    {
      query: t.Object({
        location: schema.location,
        budget: schema.budget,
        period: schema.period,
        numberOfPeople: schema.numberOfPeople,
      }),
    }
  );

  app.get(
    "/trip",
    async ({ query }) => {
      console.log("query", query);

      return query;
    },
    {
      query: t.Object({
        country: schema.country,
        location: schema.location,
        budget: schema.budget,
        period: schema.period,
        numberOfPeople: schema.numberOfPeople,
      }),
    }
  );

  return Promise.resolve(app);
};
