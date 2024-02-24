import { Country } from "src/models/country";
import { BudgetType, Location } from "src/types";

interface CriteriaWeights {
  [criterion: string]: number;
}

interface Option {
  [criterion: string]: number;
}

interface RatedOption {
  option: Option;
  overallRating: number;
}

export class DecisionEngine {
  private weights: CriteriaWeights;

  constructor(weights: CriteriaWeights) {
    this.weights = weights;
  }

  calculateAffordabilityScore(
    country: Country,
    userBudget: number,
    weights: Record<string, number>,
    budgetType: BudgetType
  ): number {
    const costOfLivingIndex = parseFloat(
      country.indexes?.costOfLivingIndex || "1"
    ); // Default to 1 if not available
    const budget = (country.travelExpenses || {})[budgetType] || {}; // Default to an empty budget if not available

    const accommodation = budget.accommodation || 0;
    const localTransportation = budget.localTransportation || 0;
    const food = budget.food || 0;
    const entertainment = budget.entertainment || 0;
    const alcohol = budget.alcohol || 0;

    const affordabilityScore =
      (userBudget / costOfLivingIndex) *
      (weights.accommodation * accommodation +
        weights.localTransportation * localTransportation +
        weights.food * food +
        weights.entertainment * entertainment +
        weights.alcohol * alcohol);

    return affordabilityScore;
  }

  calculateProximityScore(country: Country, userLocation: Location) {
    // Implement your proximity score calculation based on geospatial data
    // Return the calculated proximity score

    return 1;
  }

  calculateOverallScore(
    affordabilityScore: number,
    proximityScore: number,
    weights: Record<string, number>
  ) {
    // Combine affordability and proximity scores based on user preferences
    // Return the overall score
    return affordabilityScore + proximityScore;
  }

  selectTopCountries(
    countryData: Country[],
    userBudget: number,
    userLocation: Location,
    weights: Record<string, number>,
    budgetType: BudgetType,
    limit: number
  ) {
    const countryScores = countryData.map((country) => {
      const affordabilityScore = this.calculateAffordabilityScore(
        country,
        userBudget,
        weights,
        budgetType
      );
      const proximityScore = this.calculateProximityScore(
        country,
        userLocation
      );
      const overallScore = this.calculateOverallScore(
        affordabilityScore,
        proximityScore,
        weights
      );

      return { country, overallScore };
    });

    // Sort countries based on overall score in descending order
    const sortedCountries = countryScores.sort(
      (a, b) => b.overallScore - a.overallScore
    );

    // Select the top N countries based on the limit
    const selectedCountries = sortedCountries.slice(0, limit);

    return selectedCountries;
  }

  calculateRating(options: Option[]): RatedOption[] {
    return options.map((option) => {
      const overallRating = Object.keys(option).reduce((total, criterion) => {
        const weight = this.weights[criterion] || 0;
        const score = option[criterion] || 0;
        return total + weight * score;
      }, 0);

      return { option, overallRating };
    });
  }
}

// Example usage:
// const decisionEngine = new DecisionEngine({ cost: 0.4, weather: 0.3, attractions: 0.2, safety: 0.1 });

// const possibilities: Option[] = [
//   { country: 'Italy', cost: 8, weather: 9, attractions: 9, safety: 7 },
//   { country: 'Japan', cost: 7, weather: 8, attractions: 10, safety: 8 },
//   // Add more possibilities...
// ];

// const ratings: RatedOption[] = decisionEngine.calculateRating(possibilities);
// console.log(ratings);
