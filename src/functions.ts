import { Currency, Income } from './objects.js';

export function roundBy(income: number, base: number): number {
  return Math.floor(income / base) * base;
}

export function CurrencyToString(value: Currency): string {
  return value.amount.toLocaleString('ja-JP');
}

export function sumTaxable(taxable: Income): Currency {
  return {
    amount: taxable.salary.amount + taxable.pension.amount + taxable.other.amount,
  };
}
