import path from "node:path";
import puppeteer from "puppeteer";

import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";

console.time("total");

// Lower score is better
const DATA_SOURCE = "https://www.visionofhumanity.org/maps/#/";

const result: Record<string, string>[] = [];

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(DATA_SOURCE);

await new Promise((resolve) => setTimeout(resolve, 5000));

const tableRows = await page.$$("table tbody tr");

for await (const row of tableRows) {
  const countryName = await row.$eval("td:nth-child(2) span", (elem) =>
    elem.textContent?.trim()
  );

  const safetyIndex = await row.$eval(
    "td:nth-child(3) span b",
    (elem) => elem.textContent
  );

  if (countryName && safetyIndex) {
    result.push({ [countryName]: safetyIndex });
  }
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "country-safety-indexes.json")),
  JSON.stringify(result, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
