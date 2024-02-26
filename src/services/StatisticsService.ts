export class StatisticsService {
  static minMaxNormalization(value: number, min: number, max: number): number {
    // Normalize the value to the range [0, 1]
    const normalizedValue = (value - min) / (max - min);

    // Ensure the result is within the [0, 1] range
    return Math.min(Math.max(normalizedValue, 0), 1);
  }
}
