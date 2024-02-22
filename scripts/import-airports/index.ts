import mongoose from "mongoose";
import parse from "csv-simple-parser";
import path from "node:path";

import { AirportModel } from "src/models/airport";
import { checkIsEmpty, checkIsNumber } from "scripts/libs/type-check";

type CSVAirport = {
  AirportID: string;
  City: string;
  Country: string;
  IATA: string;
  ICAO: string;
  Latitude: string;
  Longitude: string;
  Altitude: string;
  Timezone: string;
  DST: string;
  Tz: string;
  Type: string;
  Source: string;
};

console.time("total");

if (!Bun.env.DATABASE_URL) throw new Error("Database connection URL missing");
await mongoose.connect(Bun.env.DATABASE_URL);

const file = Bun.file(path.join(import.meta.dir, "airports.csv"));
const csv = parse(await file.text(), { header: true }) as CSVAirport[];
const documents: any[] = [];
for (const row of csv) {
  const gotIata = !checkIsEmpty(row.IATA);
  const gotCity = !checkIsEmpty(row.City);
  if (!gotIata || !gotCity) continue;

  const document = new AirportModel({
    city: checkIsEmpty(row.City) ? undefined : row.City,
    country: checkIsEmpty(row.Country) ? undefined : row.Country,
    iata: row.IATA,
    icao: checkIsEmpty(row.ICAO) ? undefined : row.ICAO,
    location: {
      type: "Point",
      coordinates: [row.Latitude, row.Longitude],
    },
    alt: checkIsNumber(row.Altitude) ? parseFloat(row.Altitude) : undefined,
    timezone:
      !checkIsEmpty(row.Timezone) && checkIsNumber(row.Timezone)
        ? parseInt(row.Timezone, 10)
        : undefined,
    dst: checkIsEmpty(row.DST) ? "U" : row.DST,
  });

  documents.push(document);
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "last-ran.txt")),
  new Date().toISOString()
);

await AirportModel.bulkSave(documents);

console.timeEnd("total");

process.exit(0);
