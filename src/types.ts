import { BUDGET_TYPES } from "./constants";

export type Location = { lat: number; long: number };

export type SortOrder = "asc" | "desc";

export type BudgetType = (typeof BUDGET_TYPES)[number];

export type TravelPeriod = { start: Date; end: Date };

export type Weights = "proximity" | "travelPeriod" | "safety";

export enum Currency {
  USD = "USD",
}
