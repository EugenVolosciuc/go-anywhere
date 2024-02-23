import parse from "csv-simple-parser";
import path from "node:path";
import * as cheerio from "cheerio";

import { UNCountries } from "scripts/import-countries/un-countries";
import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";
import { getDollarAmount } from "scripts/libs/get-dollar-amount";
import { CSVCountry, CountryExpenses } from "scripts/types";
import { sleep } from "bun";

console.time("total");

const DATA_SOURCE = "https://www.budgetyourtrip.com/budgetreportadv.php";

const countriesFile = Bun.file(
  path.join(import.meta.dir, "..", "import-countries", "countries.csv")
);
const countries = parse(await countriesFile.text(), {
  header: true,
}) as CSVCountry[];

const countriesExpensesFile = Bun.file(
  path.join(import.meta.dir, "countries-expenses.json")
);
const countriesExpenses = JSON.parse(
  await countriesExpensesFile.text()
) as CountryExpenses[];

const dataForUNCountries = countries.reduce<CSVCountry[]>(
  (accumulator, country) => {
    if (UNCountries.includes(country.name)) accumulator.push(country);
    return accumulator;
  },
  []
);

const errors = [];
let countryIndex = 0;
for await (const UNCountry of dataForUNCountries) {
  try {
    const response = await fetch(
      `${DATA_SOURCE}?geonameid=&country_code=${UNCountry["alpha-2"]}`
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const countryIndexInExpensesList = countriesExpenses.findIndex(
      (countryExpenses) => {
        return (
          countryExpenses["alpha-2"] === UNCountry["alpha-2"] &&
          countryExpenses.budgetType === 1
        );
      }
    );

    const accomodationInfo = $(".accom-widget-options .accom-button-cost");

    let budgetAccommodation,
      midRangeAccommodation,
      luxuryAccommodation: number | undefined;

    accomodationInfo.each((index, el) => {
      switch (index) {
        case 1:
          budgetAccommodation = getDollarAmount($(el).text()) || undefined;
          break;
        case 2:
          midRangeAccommodation = getDollarAmount($(el).text()) || undefined;
        case 3:
          luxuryAccommodation = getDollarAmount($(el).text()) || undefined;
      }
    });

    countriesExpenses[countryIndexInExpensesList].accommodation =
      budgetAccommodation;
    countriesExpenses[countryIndexInExpensesList + 1].accommodation =
      midRangeAccommodation;
    countriesExpenses[countryIndexInExpensesList + 2].accommodation =
      luxuryAccommodation;

    console.log(`Got info for ${UNCountry["alpha-2"]}.`);
    console.log(
      `budget: ${budgetAccommodation}, mid range: ${midRangeAccommodation}, luxury: ${luxuryAccommodation}`
    );
  } catch (error) {
    console.log("error", error);
    console.warn(`Could not get accommodation for ${UNCountry["alpha-2"]}.`);
    errors.push(UNCountry["alpha-2"]);
  }

  await sleep(2000);

  countryIndex++;
}

if (errors.length > 0) {
  console.error("Got the following errors:");
  for (let i = 0; i < errors.length; i++) {
    console.info(errors[i]);
  }
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "updated-countries-expenses.json")),
  JSON.stringify(countriesExpenses, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
