import { Currency } from './objects.js';

export function roundBy(income: number, base: number): number {
  return Math.floor(income / base) * base;
}

export function roundCurrency(income: Currency, base: number): Currency {
  return { amount: roundBy(income.amount, base) };
}

export function CurrencyToString(value: Currency): string {
  return value.amount.toLocaleString('ja-JP');
}

export function sumTaxable(taxable: Record<string, Currency>): Currency {
  return sumCurrency(taxable.salary, taxable.pension, taxable.other);
}

export function sumCurrency(...currencies: Currency[]): Currency {
  return currencies.reduce(
    (acc, currency) => {
      return { amount: acc.amount + currency.amount };
    },
    { amount: 0 }
  );
}

export function subtractCurrency(a: Currency, b: Currency): Currency {
  return { amount: Math.max(a.amount - b.amount, 0) };
}

export function multiplyCurrency(a: Currency, b: number): Currency {
  return { amount: a.amount * b };
}
