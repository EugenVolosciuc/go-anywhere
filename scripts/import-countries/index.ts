import parse from "csv-simple-parser";
import mongoose from "mongoose";
import path from "node:path";

import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";
import { CSVCountry, CountryExpenses, CountryIndexData } from "scripts/types";
import { CountryModel } from "src/models/country";
import bestMonthsToVisit from "./best-months-to-visit";
import { Location } from "src/types";

console.time("total");

if (!Bun.env.DATABASE_URL) throw new Error("Database connection URL missing");
await mongoose.connect(Bun.env.DATABASE_URL);

const countriesDataFile = Bun.file(path.join(import.meta.dir, "countries.csv"));
const countriesData = parse(await countriesDataFile.text(), {
  header: true,
}) as CSVCountry[];

const countryIndexesFile = Bun.file(
  path.join(
    import.meta.dir,
    "..",
    "scrape-country-indexes",
    "country-indexes.json"
  )
);
const countryIndexes = JSON.parse(
  await countryIndexesFile.text()
) as CountryIndexData[];

const coordinatesFile = Bun.file(
  path.join(import.meta.dir, "central-coordinates.json")
);
const coordinates = JSON.parse(await coordinatesFile.text()) as Record<
  string,
  Location
>;

const countryTravelExpensesFile = Bun.file(
  path.join(
    import.meta.dir,
    "..",
    "scrape-country-expenses",
    "countries-expenses.json"
  )
);
const countryTravelExpenses = JSON.parse(
  await countryTravelExpensesFile.text()
) as CountryExpenses[];

const gotNoExpensesInfoForCountry = ({
  accommodation,
  alcohol,
  entertainment,
  food,
  localTransportation,
}: CountryExpenses) => {
  return (
    !accommodation &&
    !alcohol &&
    !entertainment &&
    !food &&
    !localTransportation
  );
};

const countries = [];

for (let i = 0; i < countryTravelExpenses.length / 3; i++) {
  const budgetExpenses = countryTravelExpenses[i * 3];
  const midRangeExpenses = countryTravelExpenses[i * 3 + 1];
  const luxuryExpenses = countryTravelExpenses[i * 3 + 2];
  const alpha2 = budgetExpenses["alpha-2"];

  const countryInfo = countriesData.find(
    (country) => country["alpha-2"] === alpha2
  );

  if (!countryInfo) {
    console.warn(`Could not find country data for ${alpha2}`);
    continue;
  }

  const indexData = countryIndexes.find(
    (country) => country.country === countryInfo?.name
  );

  let indexes;

  if (!!indexData) {
    const { country: _country, ...restOfIndexData } = indexData;
    indexes = restOfIndexData;
  }

  const countryCoordinates = coordinates[alpha2];

  const country = new CountryModel({
    name: countryInfo.name,
    alpha2: countryInfo["alpha-2"],
    alpha3: countryInfo["alpha-3"],
    countryCode: countryInfo["country-code"],
    region: countryInfo.region,
    regionCode: countryInfo["region-code"],
    "iso3166-2": countryInfo["iso_3166-2"],
    intermediateRegion: countryInfo["intermediate-region"],
    intermediateRegionCode: countryInfo["intermediate-region-code"],
    subRegion: countryInfo["sub-region"],
    subRegionCode: countryInfo["sub-region-code"],
    location: {
      type: "Point",
      coordinates: [countryCoordinates.long, countryCoordinates.lat],
    },
    indexes,
    travelExpenses: {
      "1": gotNoExpensesInfoForCountry(budgetExpenses)
        ? undefined
        : budgetExpenses,
      "2": gotNoExpensesInfoForCountry(midRangeExpenses)
        ? undefined
        : midRangeExpenses,
      "3": gotNoExpensesInfoForCountry(luxuryExpenses)
        ? undefined
        : luxuryExpenses,
    },
    bestMonthsToVisit: bestMonthsToVisit[countryInfo["alpha-2"]],
  });

  countries.push(country);
}

await CountryModel.bulkSave(countries);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
