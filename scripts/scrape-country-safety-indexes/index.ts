import path from "node:path";
import * as cheerio from "cheerio";
import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";

console.time("total");

const DATA_SOURCE = "https://www.travelsafe-abroad.com/countries/";
const response = await fetch(DATA_SOURCE);
const html = await response.text();

// TODO: Need to update this script. The indexes are more on the bad side of things,
// might want to make an average between the "oficial" index and the user sentiment,
// this requires going through each country's page

const $ = cheerio.load(html);

const table = $(".sortable.index-table");

const result: Record<string, string>[] = [];

$("tbody tr", table).each((rowIndex, row) => {
  const countryName = $("td a", row).text();
  const index = $("td span", row).text();

  result.push({ [countryName]: index });
});

await Bun.write(
  Bun.file(path.join(import.meta.dir, "country-safety-indexes.json")),
  JSON.stringify(result, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
