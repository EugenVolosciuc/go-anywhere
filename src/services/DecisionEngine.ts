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
