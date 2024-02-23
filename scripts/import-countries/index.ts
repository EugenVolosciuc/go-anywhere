import parse from "csv-simple-parser";
import path from "node:path";

import { UNCountries } from "./un-countries";
import { arrayDifference } from "scripts/libs/array-difference";
import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";

console.time("total");

export type CVSCountry = {
  name: string;
  "alpha-2": string;
  "alpha-3": string;
  "country-code": string;
  "iso_3166-2": string;
  region: string;
  "sub-region": string;
  "intermediate-region": string;
  "region-code": string;
  "sub-region-code": string;
  "intermediate-region-code": string;
};

type CountryIndexData = {
  rank: string;
  country: string;
  costOfLivingIndex: string;
  rentIndex: string;
  costOfLivingIndexPlusRentIndex: string;
  groceriesIndex: string;
  restaurantPriceIndex: string;
  localPurchasingPowerIndex: string;
};

const countriesFile = Bun.file(path.join(import.meta.dir, "countries.csv"));
const countries = parse(await countriesFile.text(), {
  header: true,
}) as CVSCountry[];

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

const csvNames = countries.map((country) => country.name);

const differenceAB = arrayDifference(UNCountries, csvNames);

console.log("differenceAB", differenceAB);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
