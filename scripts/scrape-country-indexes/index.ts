import path from "node:path";
import * as cheerio from "cheerio";
import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";

console.time("total");

const DATA_SOURCE =
  "https://www.numbeo.com/cost-of-living/rankings_by_country.jsp";
const response = await fetch(DATA_SOURCE);
const html = await response.text();

const $ = cheerio.load(html);

// Find the table element
const table = $("#t2");

// Initialize an array to store the result
const result: Record<string, string>[] = [];

// Doing this manually because of no time to modify the script
const headers = [
  "rank",
  "country",
  "costOfLivingIndex",
  "rentIndex",
  "costOfLivingIndexPlusRentIndex",
  "groceriesIndex",
  "restaurantPriceIndex",
  "localPurchasingPowerIndex",
];
// Iterate through each table row
$("tr", table).each((rowIndex, row) => {
  const rowData: Record<string, string> = {};

  // Skip the header row
  if (rowIndex > 0) {
    // Iterate through each cell in the row
    $("td, th", row).each((cellIndex, cell) => {
      const content = $(cell).text().trim();

      // Use header as the key and content as the value in the rowData object
      if (cellIndex === 0) {
        rowData[headers[cellIndex]] = rowIndex.toString();
      } else {
        rowData[headers[cellIndex]] = content;
      }
    });

    // Push the rowData object to the result array
    result.push(rowData);
  }
});

await Bun.write(
  Bun.file(path.join(import.meta.dir, "country-indexes.json")),
  JSON.stringify(result, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
