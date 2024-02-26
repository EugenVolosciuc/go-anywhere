import path from "node:path";
import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";

import { CountryIndexData } from "scripts/types";

console.time("total");

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
  await countrySafetyIndexesFile.text()
) as Record<string, string>[];

console.log("countrySafetyIndexes length", countrySafetyIndexes.length);

for (let i = 0; i < countryIndexes.length; i++) {
  const indexObject =
    countrySafetyIndexes.find((index) => {
      return Object.keys(index)[0] === countryIndexes[i].country;
    }) || {};
  countryIndexes[i].safetyIndex = indexObject[countryIndexes[i].country];
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "country-indexes.json")),
  JSON.stringify(countryIndexes, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
