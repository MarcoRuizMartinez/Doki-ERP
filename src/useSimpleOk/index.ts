export interface Summary {
    sum: number;
    mean: number;
  }
  /**
   * Sum the elements of an array
   *
   * @param arr - the input array
   *
   * @returns The sum of all elements of the array
   */
  export function sum(arr: number[]): number {
    let result = 0;
    for (let i = 0; i < arr.length; ++i) {
      result += arr[i];
    }
    return result;
  }
  /**
   * Mean the elements of an array
   *
   * @param arr - the input array
   *
   * @returns The mean of all elements of the array
   */
  export function mean(arr: number[]): number {
    return sum(arr) / arr.length;
  }
  /**
   * Calculate the sum and mean the elements of an array
   *
   * @param arr - the input array
   *
   * @returns A Summary object with the sum and the mean of all elements of the array
   */
  export function summary(arr: number[]): Summary {
    return {
      sum: sum(arr),
      mean: mean(arr),
    };
  }
  /**
   * Multiply all values by a scalar
   *
   * @param arr - the input array
   * @param value - a real number
   *
   * @returns An array with the original array values multiplied by the indicated scalar
   */
  export function multiply(arr: number[], value: number): number[] {
    const result = arr.slice();
    if (value === undefined) {
      return result;
    }
    for (let i = 0; i < arr.length; ++i) {
      result[i] = arr[i] * value;
    }
    return result;
  }