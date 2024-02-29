import { t } from "elysia";

import { Currency } from "types";

export const location = t.ObjectString({
  lat: t.Numeric(),
  long: t.Numeric(),
});

export const budget = t.ObjectString({
  min: t.Optional(t.Numeric()), // NOTE: not putting in the equation for now
  max: t.Numeric(), // TODO: max can't be less than min
  currency: t.Enum(Currency, { default: Currency.USD }),
});

export const period = t.ObjectString({
  start: t.Date(),
  end: t.Date(),
});

export const numberOfPeople = t.Numeric(t.Integer());

export const country = t.String({ minLength: 2, maxLength: 2 });
