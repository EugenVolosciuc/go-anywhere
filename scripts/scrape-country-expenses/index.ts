import * as cheerio from "cheerio";
import parse from "csv-simple-parser";
import path from "node:path";

import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";
import { UNCountries } from "scripts/import-countries/un-countries";
import { sleep } from "bun";
import { getDollarAmount } from "scripts/libs/get-dollar-amount";
import { CSVCountry, CountryExpenses, EXPENSE_TYPE } from "scripts/types";

// TODO: Delete this after modifying the accommodation part of the script
throw new Error(
  "Please update the accommodation part of the script before running it"
);

console.time("total");

// NOTE: all expenses are for a single person, in USD

export const DATA_SOURCE = "https://www.budgetyourtrip.com/budgetreportadv.php";
const BUDGET_TYPES = [1, 2, 3]; // budget, mid-range, luxury

const EXPENSE_TYPE_MAP: Omit<
  Record<EXPENSE_TYPE, number>,
  EXPENSE_TYPE.ACCOMMODATION
> = {
  localTransportation: 3,
  food: 4,
  entertainment: 6,
  alcohol: 12,
};

const countriesFile = Bun.file(
  path.join(import.meta.dir, "..", "import-countries", "countries.csv")
);
const countries = parse(await countriesFile.text(), {
  header: true,
}) as CSVCountry[];

const dataForUNCountries = countries.reduce<CSVCountry[]>(
  (accumulator, country) => {
    if (UNCountries.includes(country.name)) accumulator.push(country);
    return accumulator;
  },
  []
);

const errors = [];
const countriesExpenses: CountryExpenses[] = [];

for await (const country of dataForUNCountries) {
  for await (const budgetType of BUDGET_TYPES) {
    const countryExpenses: CountryExpenses = {
      "alpha-2": country["alpha-2"],
      budgetType,
    };
    try {
      const response = await fetch(
        `${DATA_SOURCE}?geonameid=&country_code=${country["alpha-2"]}&budgettype=${budgetType}`
      );
      const html = await response.text();
      const $ = cheerio.load(html);

      const statsTable = $(".statstable");
      for (const expenseType in EXPENSE_TYPE_MAP) {
        const expenseRow = statsTable.find(
          `[data-row="${
            EXPENSE_TYPE_MAP[
              expenseType as Exclude<EXPENSE_TYPE, EXPENSE_TYPE.ACCOMMODATION>
            ]
          }"]`
        );

        if (expenseRow) {
          const amountText = expenseRow.find("td.value").text();
          const dollarAmount = getDollarAmount(amountText);

          if (dollarAmount)
            countryExpenses[expenseType as EXPENSE_TYPE] = dollarAmount;
        } else {
          console.info(`No info about ${expenseType} expenses.`);
        }
      }
      // TODO: switch to getting info from ".accom-widget-options .accom-button-cost" + budget type
      const accommodationCost = $(
        ".cost-tile-category-accommodation .cost-tile-value.not-bottom .curvalue"
      )
        .first()
        .text();

      countryExpenses.accommodation = parseFloat(accommodationCost);

      countriesExpenses.push(countryExpenses);
      console.log(
        `Got info for ${country["alpha-2"]}, budget type ${budgetType}.`
      );
    } catch (error) {
      errors.push(
        `Could not get info for ${country["alpha-2"]}, budget type ${budgetType}.`
      );
    }

    await sleep(2000);
  }
}

if (errors.length > 0) {
  console.error("Got the following errors:");
  for (let i = 0; i < errors.length; i++) {
    console.info(errors[i]);
  }
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "countries-expenses.json")),
  JSON.stringify(countriesExpenses, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
