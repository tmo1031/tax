import { Currency } from './objects.js';

export function RoundBy(income: number, base: number): number {
  return Math.floor(income / base) * base;
}

export function CurrencyToString(value: Currency): string {
  return value.amount.toLocaleString('ja-JP');
}
