import mongoose, { InferSchemaType } from "mongoose";

import { pointSchema } from "src/models/point";

// One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown)
enum DST {
  E = "E",
  A = "A",
  S = "S",
  O = "O",
  Z = "Z",
  N = "N",
  U = "U",
}

const airportSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  iata: { type: String, required: true, index: { unique: true } }, // 3-letter IATA code
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere",
  },
  icao: { type: String, required: false }, // 4-letter ICAO code
  alt: { type: Number, required: false }, // In meters
  timezone: { type: Number, required: false }, // Hours offset from UTC. Fractional hours are expressed as decimals
  dst: {
    type: String,
    required: false,
    enum: {
      values: Object.values(DST),
      message:
        "Daylight savings time must be one of the following: E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown)",
    },
  }, // Daylight savings time,
});

export type Airport = InferSchemaType<typeof airportSchema>;

export const AirportModel = mongoose.model("Airport", airportSchema);
