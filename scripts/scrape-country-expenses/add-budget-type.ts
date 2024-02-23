import path from "node:path";

import { saveTimeLastRan } from "scripts/libs/save-time-last-ran";
import { CountryExpenses } from "scripts/types";

console.time("total");

const countriesExpensesFile = Bun.file(
  path.join(import.meta.dir, "countries-expenses.json")
);

const countriesExpenses = JSON.parse(
  await countriesExpensesFile.text()
) as CountryExpenses[];

for (let i = 0; i < countriesExpenses.length; i++) {
  countriesExpenses[i].budgetType = (i % 3) + 1;
}

await Bun.write(
  Bun.file(path.join(import.meta.dir, "countries-expenses.json")),
  JSON.stringify(countriesExpenses, undefined, 2)
);

await saveTimeLastRan();

console.timeEnd("total");

process.exit(0);
