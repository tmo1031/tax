export function RoundBy(income: number, base: number): number {
  return Math.floor(income / base) * base;
}
