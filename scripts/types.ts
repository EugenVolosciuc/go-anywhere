export enum EXPENSE_TYPE {
  ACCOMMODATION = "accommodation",
  LOCAL_TRANSPORTATION = "localTransportation",
  FOOD = "food",
  ENTERTAINMENT = "entertainment",
  ALCOHOL = "alcohol",
}

export type CountryExpenses = Partial<Record<EXPENSE_TYPE, number>> & {
  "alpha-2": string;
  budgetType: number;
};

export type CSVCountry = {
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

export type CountryIndexData = {
  rank: string;
  country: string;
  costOfLivingIndex: string;
  rentIndex: string;
  costOfLivingIndexPlusRentIndex: string;
  groceriesIndex: string;
  restaurantPriceIndex: string;
  localPurchasingPowerIndex: string;
};
