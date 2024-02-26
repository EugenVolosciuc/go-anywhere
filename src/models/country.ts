import mongoose, { InferSchemaType } from "mongoose";

import { pointSchema } from "./point";

const countryIndexesSchema = new mongoose.Schema({
  rank: { type: String, required: true },
  costOfLivingIndex: { type: String, required: true },
  rentIndex: { type: String, required: true },
  costOfLivingIndexPlusRentIndex: { type: String, required: true },
  groceriesIndex: { type: String, required: true },
  restaurantPriceIndex: { type: String, required: true },
  localPurchasingPowerIndex: { type: String, required: true },
  safetyIndex: { type: String, required: false },
});

const countryTravelExpensesSchema = new mongoose.Schema({
  accommodation: { type: Number, required: false },
  localTransportation: { type: Number, required: false },
  food: { type: Number, required: false },
  entertainment: { type: Number, required: false },
  alcohol: { type: Number, required: false },
});

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  alpha2: { type: String, required: true, index: true },
  alpha3: { type: String, required: true },
  countryCode: { type: String, required: true },
  "iso3166-2": { type: String, required: true },
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere",
  },
  region: { type: String, required: true },
  subRegion: { type: String, required: false },
  intermediateRegion: { type: String, required: false },
  regionCode: { type: String, required: false },
  subRegionCode: { type: String, required: false },
  intermediateRegionCode: { type: String, required: false },
  indexes: { type: countryIndexesSchema, required: false },
  travelExpenses: {
    1: {
      type: countryTravelExpensesSchema, // budget
      required: false,
    },
    2: {
      type: countryTravelExpensesSchema, // mid-range
      required: false,
    },
    3: {
      type: countryTravelExpensesSchema, // luxury
      required: false,
    },
  },
  bestMonthsToVisit: {
    type: [Number],
    required: true,
  },
});

export type Country = InferSchemaType<typeof countrySchema>;

export const CountryModel = mongoose.model("Country", countrySchema);
