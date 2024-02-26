import path from "node:path";
import { CountryIndexData } from "scripts/types";

const countryIndexesFile = Bun.file(
  path.join(import.meta.dir, "country-indexes.json")
);
const countryIndexes = JSON.parse(
  await countryIndexesFile.text()
) as CountryIndexData[];

const countrySafetyIndexesFile = Bun.file(
  path.join(
    import.meta.dir,
    "..",
    "scrape-country-safety-indexes",
    "country-safety-indexes.json"
  )
);
const countrySafetyIndexes = JSON.parse(
  await countryIndexesFile.text()
) as Record<string, string>[];

console.log("countrySafetyIndexes length", countrySafetyIndexes.length);

for (let i = 0; i < countrySafetyIndexes.length; i++) {}
