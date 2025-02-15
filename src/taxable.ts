import { profiles, system, carryOvers } from './objects.js';
import { Currency, Profiles } from './objects.js';
import { roundBy, sumTaxable } from './functions.js';

type TaxValue = {
  year: number;
  max10Per: number;
  max5Per: number;
};

type MaxTable = {
  fortyPer: number;
  thirtyPer: number;
  twentyPer: number;
  tenPer: number;
  fivePer: number;
  zeroPer: number;
};

type Threshold = {
  limit: number;
  discountRate: number;
};

type TaxRateResult = {
  rate: number;
  deduction: number;
  offset: number;
};

function calcTaxable(taxYear: number, income: number): { total: number; taxable: number; deduction: number } {
  function getValuesForYear(values: TaxValue[], year: number, keys: (keyof TaxValue)[]): Partial<TaxValue> {
    const result: Partial<TaxValue> = {};
    for (const item of values) {
      if (year >= item.year) {
        keys.forEach((key) => {
          result[key] = item[key] === null ? undefined : item[key];
        });
        break;
      }
    }
    return result;
  }

  function getIncomeTaxRate(taxYear: number, income: number): TaxRateResult {
    const taxValues: TaxValue[] = [
      { year: 2020, max10Per: 8500000, max5Per: Infinity },
      { year: 2017, max10Per: 10000000, max5Per: Infinity },
      { year: 2016, max10Per: 10000000, max5Per: 12000000 },
      { year: 2013, max10Per: 10000000, max5Per: 15000000 },
      { year: 1995, max10Per: 10000000, max5Per: Infinity },
    ];

    const values = getValuesForYear(taxValues, taxYear, ['max10Per', 'max5Per']);
    const maxTable: MaxTable = {
      fortyPer: 1800000,
      thirtyPer: 3600000,
      twentyPer: 6600000,
      tenPer: values.max10Per ?? Infinity,
      fivePer: values.max5Per ?? Infinity,
      zeroPer: Infinity,
    };

    const thresholds: Threshold[] = [
      { limit: 0, discountRate: 0.5 },
      { limit: maxTable.fortyPer, discountRate: 0.4 },
      { limit: maxTable.thirtyPer, discountRate: 0.3 },
      { limit: maxTable.twentyPer, discountRate: 0.2 },
      { limit: maxTable.tenPer, discountRate: 0.1 },
      { limit: maxTable.zeroPer, discountRate: 0 },
    ];

    if (maxTable.fivePer !== Infinity) {
      thresholds.splice(5, 0, { limit: maxTable.fivePer, discountRate: 0.05 });
    }

    let deductionSum = 0;
    let rate = 0;
    for (let i = 1; i < thresholds.length; i++) {
      const limit = thresholds[i].limit;
      rate = 1 - thresholds[i].discountRate;
      if (income < limit) {
        for (let j = 0; j < i; j++) {
          deductionSum += (thresholds[j].discountRate - thresholds[j + 1].discountRate) * thresholds[j].limit;
        }
        return { rate: 1 - thresholds[i].discountRate, deduction: deductionSum, offset: taxYear >= 2020 ? -100000 : 0 };
      }
    }
    return { rate: rate, deduction: deductionSum, offset: taxYear >= 2020 ? -100000 : 0 };
  }

  const incomeTaxSystem = getIncomeTaxRate(taxYear, income);

  let taxable;
  if (taxYear >= 1995) {
    taxable =
      income < 1619000
        ? income - 650000
        : income < 1620000
          ? 969000
          : income < 1622000
            ? 970000
            : income < 1624000
              ? 972000
              : income < 1628000
                ? 974000
                : incomeTaxSystem.rate < 0.9
                  ? roundBy(income, 4000) * incomeTaxSystem.rate - incomeTaxSystem.deduction
                  : incomeTaxSystem.rate < 0.99
                    ? roundBy(income * incomeTaxSystem.rate, 1) - incomeTaxSystem.deduction
                    : income - incomeTaxSystem.deduction;
  } else taxable = 0;

  taxable = Math.max(taxable - incomeTaxSystem.offset, 0);
  return {
    total: income,
    taxable: taxable,
    deduction: income - taxable,
  };
}

function getSalaryExpensesSp(
  taxYear: number,
  salaryExpensesSpRaw: number,
  deduction: number,
  salaryIncome: number
): number {
  const thresholds = (() => {
    if (taxYear < 2013) return [{ limit: Infinity, rate: 1, maxDeduction: Infinity }];
    else
      return [
        { limit: 15000000, rate: 0.5, maxDeduction: Infinity },
        { limit: Infinity, rate: Infinity, maxDeduction: 1250000 },
      ];
  })();

  let rate = 1;
  let maxDeduction = Infinity;

  for (const threshold of thresholds) {
    if (salaryIncome <= threshold.limit) {
      rate = threshold.rate;
      maxDeduction = threshold.maxDeduction;
      break;
    }
  }
  const base = Math.min(deduction * rate, maxDeduction);

  return Math.max(salaryExpensesSpRaw - base, 0);
}

function calcTaxablePension(
  taxYear: number,
  pensionIncome: number,
  age: number,
  totalIncome: number
): { taxable: number; deduction: number } {
  const thresholds = (() => {
    if (taxYear < 2005) {
      if (age < 65) {
        return [
          { limit: 700000, floor: 0, rate: 1, max: Infinity },
          { limit: 1300000, floor: 700000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      } else {
        return [
          { limit: 1400000, floor: 0, rate: 1, max: Infinity },
          { limit: 2600000, floor: 1400000, rate: 0, max: Infinity },
          { limit: 4600000, floor: 2600000, rate: 0.25, max: Infinity },
          { limit: 8200000, floor: 4600000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 8200000, rate: 0.05, max: Infinity },
        ];
      }
    } else if (taxYear < 2020) {
      if (age < 65) {
        return [
          { limit: 700000, floor: 0, rate: 1, max: Infinity },
          { limit: 1300000, floor: 700000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      } else {
        return [
          { limit: 1200000, floor: 0, rate: 1, max: Infinity },
          { limit: 3300000, floor: 1200000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      }
    } else {
      if (age < 65) {
        if (totalIncome <= 10000000) {
          return [
            { limit: 600000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 600000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else if (totalIncome <= 20000000) {
          return [
            { limit: 500000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 500000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else {
          return [
            { limit: 400000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 400000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        }
      } else {
        if (totalIncome <= 10000000) {
          return [
            { limit: 1100000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 1100000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else if (totalIncome <= 20000000) {
          return [
            { limit: 1000000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 1000000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else {
          return [
            { limit: 900000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 900000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        }
      }
    }
  })();

  let deduction = 0;
  for (const threshold of thresholds) {
    deduction += (Math.min(pensionIncome, threshold.limit) - threshold.floor) * threshold.rate;
    if (pensionIncome <= threshold.limit) {
      break;
    }
  }
  console.log('deduction:', deduction);

  return { taxable: pensionIncome - deduction, deduction: deduction };
}

function getSalaryAdjustment(
  taxYear: number,
  salaryRevenue: number,
  salaryTaxable: number,
  pensionTaxable: number,
  disability: number,
  minors: number
): { dependent: number; doubleIncome: number } {
  if (taxYear < 2020) return { dependent: 0, doubleIncome: 0 };
  const adjustmentDependent =
    disability > 0 || minors > 0 ? Math.max(Math.min(salaryRevenue, 10000000) - 8500000, 0) * 0.1 : 0;
  const salaryTaxableAdjusted = salaryTaxable - adjustmentDependent;
  const adjustmentSalary = Math.min(100000, salaryTaxableAdjusted);
  const adjustmentPension = Math.min(100000, pensionTaxable);
  const adjustmentDoubleIncome =
    salaryTaxable > 0 && pensionTaxable > 0 ? Math.max(0, adjustmentSalary + adjustmentPension - 100000) : 0;
  return { dependent: adjustmentDependent, doubleIncome: adjustmentDoubleIncome };
}

function aggregationPL(mode: string, detail: Record<string, Record<string, Currency>>) {
  let total = 0;
  Object.entries(detail).forEach(([key, value]) => {
    console.log(`Processing ${key}:`, value);
    const keys = ['retirementLong', 'retirementShort'];
    const rate = keys.includes(key) ? 0.5 : 1;

    value.income.amount =
      (value.revenue.amount -
        (isNaN(value.expenses.amount) ? 0 : value.expenses.amount) -
        (isNaN(value.deductions.amount) ? 0 : value.deductions.amount)) *
      rate;
  });
  const business = detail.business.income.amount + detail.farming.income.amount;
  const property = detail.property.income.amount;
  const interest = detail.interest.income.amount;
  const dividend = Math.max(detail.dividend.income.amount, 0);
  const salary = Math.max(detail.salary.income.amount, 0);
  const misc = Math.max(mode === 'exceptPension' ? 0 : detail.pension.income.amount + detail.misc.income.amount, 0);
  const ordinary = business + property + interest + dividend + salary + misc;
  //譲渡と一時所得の計算
  const gainPL = {
    shortSeparate: detail.shortSeparate.income.amount,
    shortAggregate: detail.shortAggregate.income.amount,
    longSeparate: detail.longSeparate.income.amount,
    longAggregate: detail.longAggregate.income.amount,
    houseLoss: 0,
  };
  //差引計算
  if (
    (gainPL.shortSeparate >= 0 &&
      gainPL.shortAggregate >= 0 &&
      gainPL.longSeparate >= 0 &&
      gainPL.longAggregate >= 0) ||
    (gainPL.shortSeparate <= 0 && gainPL.shortAggregate <= 0 && gainPL.longSeparate <= 0 && gainPL.longAggregate <= 0)
  ) {
    //
  } else {
    const separateSum = gainPL.shortSeparate + gainPL.longSeparate;
    const aggregateSum = gainPL.shortAggregate + gainPL.longAggregate;
    if (gainPL.shortSeparate <= 0) {
      if (gainPL.longSeparate >= 0) {
        //短期分離譲渡が赤字で長期分離譲渡が黒字の場合(houseLossは0)
        gainPL.longSeparate = Math.max(separateSum, 0);
        gainPL.shortSeparate = 0;
      } else {
        //短期分離譲渡と長期分離譲渡が両方赤字の場合
        gainPL.longSeparate = Math.min(0, gainPL.houseLoss);
        gainPL.shortSeparate = 0;
      }
    } else {
      if (gainPL.longSeparate >= 0) {
        //短期分離譲渡と長期分離譲渡が両方黒字の場合
      } else if (separateSum >= 0) {
        //短期分離譲渡が黒字で長期分離譲渡が赤字の場合(相殺可能)
        gainPL.shortSeparate = separateSum;
        gainPL.longSeparate = 0;
      } else {
        //短期分離譲渡が黒字で長期分離譲渡が赤字の場合(相殺不可能)
        gainPL.shortSeparate = 0;
        gainPL.longSeparate = Math.max(separateSum, gainPL.houseLoss);
      }
      gainPL.houseLoss = gainPL.longSeparate < 0 ? gainPL.longSeparate : 0;
    }

    if (gainPL.shortAggregate <= 0) {
      if (aggregateSum >= 0) {
        //短期総合譲渡が赤字で長期総合譲渡が黒字の場合(相殺可能)
        gainPL.longAggregate = Math.max(aggregateSum + gainPL.houseLoss, 0);
        gainPL.shortAggregate = 0;
        gainPL.houseLoss = Math.min(gainPL.houseLoss + aggregateSum);
      } else if (gainPL.longAggregate >= 0) {
        //短期総合譲渡が赤字で長期総合譲渡の黒字が相殺しきれない場合
        gainPL.longAggregate = 0;
        gainPL.shortAggregate = aggregateSum;
      } else {
        //短期総合譲渡と長期総合譲渡が両方赤字の場合
      }
    } else {
      if (gainPL.longAggregate >= 0) {
        //短期総合譲渡と長期総合譲渡が両方黒字の場合(houseLossの相殺計算のみ)
        const prof_loss = gainPL.shortAggregate + gainPL.houseLoss;
        gainPL.shortAggregate = Math.max(prof_loss, 0);
        gainPL.longAggregate =
          gainPL.shortAggregate === 0 ? Math.max(prof_loss + gainPL.longAggregate, 0) : gainPL.longAggregate;
        gainPL.houseLoss = Math.min(0, gainPL.houseLoss + aggregateSum);
      } else if (aggregateSum >= 0) {
        //短期総合譲渡が黒字で長期総合譲渡が赤字の場合(相殺可能)
        gainPL.shortAggregate = Math.max(aggregateSum + gainPL.houseLoss, 0);
        gainPL.longAggregate = 0;
        gainPL.houseLoss = Math.min(0, gainPL.houseLoss + aggregateSum);
      } else {
        //短期総合譲渡が黒字で長期総合譲渡が赤字の場合(相殺不可能)
        gainPL.shortAggregate = 0;
        gainPL.longAggregate = aggregateSum;
      }
    }
  }
  const occasionalPL = Math.max(detail.occasional.income.amount, 0);
  //特別控除の計算
  const aggregateSumPL = gainPL.shortAggregate + gainPL.longAggregate;
  const gainDeduction = {
    shortSeparate: 0,
    shortAggregate: 0,
    longSeparate: 0,
    longAggregate: 0,
    houseLoss: 0,
  };
  const deductionLimit = 500000;
  if (gainPL.shortAggregate >= 0) {
    if (gainPL.longAggregate >= 0) {
      if (aggregateSumPL <= deductionLimit) {
        gainDeduction.shortAggregate = Math.max(gainPL.shortAggregate, 0);
        gainDeduction.longAggregate = Math.max(gainPL.longAggregate, 0);
      } else {
        gainDeduction.shortAggregate = Math.min(deductionLimit, gainPL.longAggregate);
        gainDeduction.longAggregate = Math.min(deductionLimit, deductionLimit - gainDeduction.shortAggregate);
      }
    } else {
      gainDeduction.shortAggregate = Math.min(deductionLimit, gainPL.shortAggregate);
      gainDeduction.longAggregate = 0;
    }
  } else {
    if (gainPL.longAggregate >= 0) {
      gainDeduction.shortAggregate = 0;
      gainDeduction.longAggregate = Math.min(deductionLimit, gainPL.longAggregate);
    } else {
      gainDeduction.shortAggregate = 0;
      gainDeduction.longAggregate = 0;
    }
  }
  const occasionalDeduction = Math.min(deductionLimit, occasionalPL);
  /*
  gainPL.shortSeparate = gainPL.shortSeparate >= 0 ? Math.max(gainPL.shortSeparate, 0) : 0;
  gainPL.shortAggregate = Math.max(gainPL.shortAggregate, 0);
  gainPL.longSeparate = Math.max(gainPL.longSeparate, 0);
  gainPL.longAggregate = Math.max(gainPL.longAggregate, 0);
  */
  //損失または所得の確定
  const gain = {
    shortSeparate: gainPL.shortSeparate - gainDeduction.shortSeparate,
    shortAggregate: gainPL.shortAggregate - gainDeduction.shortAggregate,
    longSeparate: gainPL.longSeparate - gainDeduction.longSeparate,
    longAggregate: gainPL.longAggregate - gainDeduction.longAggregate,
    houseLoss: gainPL.houseLoss,
  };
  let occasional = occasionalPL - occasionalDeduction;
  if (
    gainPL.shortSeparate <= 0 &&
    gainPL.shortAggregate <= 0 &&
    gainPL.longSeparate <= 0 &&
    gainPL.longAggregate <= 0 &&
    occasionalPL <= 0
  ) {
    gain.shortAggregate = gainPL.shortAggregate;
    gain.longAggregate = gainPL.longAggregate;
    gain.shortSeparate = 0;
    gain.longSeparate = Math.min(gainPL.houseLoss, 0);
    occasional = occasionalPL;
  } else if (
    gainPL.shortSeparate >= 0 &&
    gainPL.shortAggregate >= 0 &&
    gainPL.longSeparate >= 0 &&
    gainPL.longAggregate >= 0 &&
    occasionalPL >= 0
  ) {
    //Initialize で計算した値をそのまま使う
  } else if (occasionalPL >= 0) {
    const sumRed =
      (gain.shortAggregate <= 0 ? -gain.shortAggregate : 0) +
      (gain.longAggregate <= 0 ? -gain.longAggregate : 0) +
      gain.houseLoss;
    if (occasional >= sumRed) {
      gain.shortAggregate = gainPL.shortAggregate >= 0 ? gainPL.shortAggregate : 0;
      gain.longAggregate = gainPL.longAggregate >= 0 ? gainPL.longAggregate : 0;
      gain.shortSeparate = gain.shortSeparate >= 0 ? gain.shortSeparate : 0;
      gain.longSeparate = gain.longSeparate >= 0 ? gain.longSeparate : 0;
      occasional = occasional - sumRed;
    } else {
      if (gainPL.shortAggregate <= 0) {
        const delta = gainPL.shortAggregate + occasional;
        gain.shortAggregate = delta >= 0 ? 0 : delta;
        occasional = delta >= 0 ? delta : 0;
      }
      if (gainPL.longAggregate <= 0) {
        const delta = gainPL.longAggregate + occasional;
        gain.longAggregate = delta >= 0 ? 0 : delta;
        occasional = delta >= 0 ? delta : 0;
      }
      if (gainPL.longSeparate <= 0) {
        const delta = gainPL.houseLoss + occasional;
        gain.longSeparate = delta >= 0 ? 0 : delta;
        occasional = delta >= 0 ? delta : 0;
      }
      gain.shortSeparate = Math.max(gainPL.shortSeparate, 0);
    }
  }
  //山林所得の計算
  const timber = detail.timber.income.amount;
  //退職所得の計算
  const retirementLong = Math.max(Math.floor(detail.retirementLong.income.amount * 0.5), 0);
  const retirementShort =
    detail.retirementShort.income.amount <= 3000000
      ? Math.max(Math.floor(detail.retirementShort.income.amount * 0.5), 0)
      : detail.retirementShort.income.amount - 1500000;
  const retirementOfficer = detail.retirementOfficer.income.amount;
  const retirement = retirementLong + retirementShort + retirementOfficer;
  const stockUnlisted = detail.stockUnlisted.income.amount;
  const stockListed = detail.stockListed.income.amount;
  const stockDividend = detail.stockDividend.income.amount;
  const future = detail.future.income.amount;

  //損益の通算
  const netTable: Record<string, Record<string, number>> = {
    pre: {
      ordinary: ordinary,
      shortAggregate: gain.shortAggregate,
      longSeparate: gain.longSeparate > 0 ? 0 : gain.longSeparate,
      longAggregate: gain.longAggregate,
      occasional: occasional,
      gain: gain.shortAggregate + gain.longSeparate + gain.longAggregate + occasional,
      timber: timber,
      retirement: retirement,
    },
  };

  function updateNetTableFirst(
    netTable: Record<string, Record<string, number>>,
    key: string,
    delta: number,
    condition: (value: number) => boolean
  ) {
    if (condition(netTable.first.ordinary)) {
      const newDelta = netTable.first.ordinary + delta;
      netTable.first.ordinary = newDelta >= 0 ? 0 : newDelta;
      netTable.first[key] = newDelta >= 0 ? newDelta : 0;
    }
  }

  //第1次通算
  if (
    (netTable.pre.ordinary >= 0 && netTable.pre.gain >= 0) ||
    (netTable.pre.ordinary <= 0 && netTable.pre.gain <= 0)
  ) {
    netTable.first = { ...netTable.pre };
  } else if (netTable.pre.ordinary <= 0 && netTable.pre.gain >= 0) {
    netTable.first.ordinary = netTable.pre.ordinary;
    if (netTable.first.ordinary <= 0) {
      const delta = netTable.first.ordinary + netTable.pre.shortAggregate;
      netTable.first.ordinary = delta >= 0 ? 0 : delta;
      netTable.first.shortAggregate = delta >= 0 ? delta : 0;
    }
    /*-- この処理は不要 
    if (netTable.first.ordinary <= 0) {
      const delta = netTable.first.ordinary + netTable.pre.longSeparate;
      netTable.first.ordinary = delta >= 0 ? 0 : delta;
      netTable.first.longSeparate = delta >= 0 ? delta : 0;
    }
    --*/
    if (netTable.first.ordinary <= 0) {
      const delta = netTable.first.ordinary + netTable.pre.longAggregate;
      netTable.first.ordinary = delta >= 0 ? 0 : delta;
      netTable.first.longAggregate = delta >= 0 ? delta : 0;
    }
    if (netTable.first.ordinary <= 0) {
      const delta = netTable.first.ordinary + netTable.pre.occasional;
      netTable.first.ordinary = delta >= 0 ? 0 : delta;
      netTable.first.occasional = delta >= 0 ? delta : 0;
    }
  } else if (netTable.pre.ordinary >= 0 && netTable.pre.gain <= 0) {
    netTable.first.ordinary = netTable.pre.ordinary;
    if (netTable.first.ordinary >= 0) {
      const delta = netTable.first.ordinary + netTable.pre.shortAggregate;
      netTable.first.ordinary = delta <= 0 ? 0 : delta;
      netTable.first.shortAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.first.ordinary >= 0) {
      const delta = netTable.first.ordinary + netTable.pre.longSeparate;
      netTable.first.ordinary = delta <= 0 ? 0 : delta;
      netTable.first.longSeparate = delta <= 0 ? delta : 0;
    }
    if (netTable.first.ordinary >= 0) {
      const delta = netTable.first.ordinary + netTable.pre.longAggregate;
      netTable.first.ordinary = delta <= 0 ? 0 : delta;
      netTable.first.longAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.first.ordinary >= 0) {
      const delta = netTable.first.ordinary + netTable.pre.occasional;
      netTable.first.ordinary = delta <= 0 ? 0 : delta;
      netTable.first.occasional = delta <= 0 ? delta : 0;
    }
  }
  netTable.first.gain =
    netTable.first.shortAggregate +
    netTable.first.longSeparate +
    netTable.first.longAggregate +
    netTable.first.occasional;
  netTable.first.timber = netTable.pre.timber;
  netTable.first.retirement = netTable.pre.retirement;
  //第2次通算
  if (
    (netTable.first.ordinary >= 0 && netTable.first.gain >= 0 && netTable.first.timber >= 0) ||
    (netTable.first.ordinary <= 0 && netTable.first.gain <= 0 && netTable.first.timber <= 0)
  ) {
    netTable.second = { ...netTable.first };
  } else if (netTable.first.ordinary <= 0 && netTable.first.gain <= 0 && netTable.first.timber >= 0) {
    netTable.second.timber = netTable.first.timber;
    if (netTable.second.timber >= 0) {
      const delta = netTable.second.timber + netTable.first.ordinary;
      netTable.second.timber = delta <= 0 ? 0 : delta;
      netTable.second.ordinary = delta <= 0 ? delta : 0;
    }
    if (netTable.second.timber >= 0) {
      const delta = netTable.second.timber + netTable.first.shortAggregate;
      netTable.second.timber = delta <= 0 ? 0 : delta;
      netTable.second.shortAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.second.timber >= 0) {
      const delta = netTable.second.timber + netTable.first.longSeparate;
      netTable.second.timber = delta <= 0 ? 0 : delta;
      netTable.second.longSeparate = delta <= 0 ? delta : 0;
    }
    if (netTable.second.timber >= 0) {
      const delta = netTable.second.timber + netTable.first.longAggregate;
      netTable.second.timber = delta <= 0 ? 0 : delta;
      netTable.second.longAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.second.timber >= 0) {
      const delta = netTable.second.timber + netTable.first.occasional;
      netTable.second.timber = delta <= 0 ? 0 : delta;
      netTable.second.occasional = delta <= 0 ? delta : 0;
    }
  } else if (netTable.first.ordinary >= 0 && netTable.first.gain >= 0 && netTable.first.timber <= 0) {
    netTable.second.timber = netTable.first.timber;
    if (netTable.second.timber <= 0) {
      const delta = netTable.second.timber + netTable.first.ordinary;
      netTable.second.timber = delta >= 0 ? 0 : delta;
      netTable.second.ordinary = delta >= 0 ? delta : 0;
    }
    if (netTable.second.timber <= 0) {
      const delta = netTable.second.timber + netTable.first.shortAggregate;
      netTable.second.timber = delta >= 0 ? 0 : delta;
      netTable.second.shortAggregate = delta >= 0 ? delta : 0;
    }
    if (netTable.second.timber <= 0) {
      const delta = netTable.second.timber + netTable.first.longSeparate;
      netTable.second.timber = delta >= 0 ? 0 : delta;
      netTable.second.longSeparate = delta >= 0 ? delta : 0;
    }
    if (netTable.second.timber <= 0) {
      const delta = netTable.second.timber + netTable.first.longAggregate;
      netTable.second.timber = delta >= 0 ? 0 : delta;
      netTable.second.longAggregate = delta >= 0 ? delta : 0;
    }
    if (netTable.second.timber <= 0) {
      const delta = netTable.second.timber + netTable.first.occasional;
      netTable.second.timber = delta >= 0 ? 0 : delta;
      netTable.second.occasional = delta >= 0 ? delta : 0;
    }
  }
  netTable.second.gain =
    netTable.second.shortAggregate +
    netTable.second.longSeparate +
    netTable.second.longAggregate +
    netTable.second.occasional;
  netTable.second.retirement = netTable.first.retirement;
  //第3次通算
  if (
    !(
      netTable.second.ordinary <= 0 &&
      netTable.second.gain <= 0 &&
      netTable.second.timber <= 0 &&
      netTable.second.retirement >= 0
    )
  ) {
    netTable.third = { ...netTable.second };
  } else {
    //
    netTable.third.retirement = netTable.second.retirement;
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.ordinary;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.ordinary = delta <= 0 ? delta : 0;
    }
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.shortAggregate;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.shortAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.longSeparate;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.longSeparate = delta <= 0 ? delta : 0;
    }
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.longAggregate;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.longAggregate = delta <= 0 ? delta : 0;
    }
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.occasional;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.occasional = delta <= 0 ? delta : 0;
    }
    if (netTable.third.retirement >= 0) {
      const delta = netTable.third.retirement + netTable.second.timber;
      netTable.third.retirement = delta <= 0 ? 0 : delta;
      netTable.third.timber = delta <= 0 ? delta : 0;
    }
  }

  return total;
}

function getCarryover(taxable: number, carryOvers: Record<string, Currency>): number {
  function sumCarryovers(carryOvers: Record<string, Currency>): number {
    return Object.values(carryOvers).reduce((sum, currency) => sum + currency.amount, 0);
  }
  const carryOversSum = sumCarryovers(carryOvers);
  return Math.max(taxable - carryOversSum, 0);
}

function setNonTaxable(profiles: Profiles, system: Record<string, number>): Profiles {
  const taxYear = system.taxYear;
  const taxableTotal = profiles.applicant.taxable.total.amount;
  const carryOver = profiles.applicant.taxable.carryOver.amount;
  const nonTaxableAttr =
    profiles.applicant.attributes.disability > 0 ||
    profiles.applicant.attributes.minors ||
    profiles.applicant.attributes.single > 0;
  const familyMembersNum =
    1 +
    (profiles.applicant.attributes.hasSpouse ? 1 : 0) +
    Object.values(profiles.dependent).reduce((sum, value) => sum + value, 0);
  function getNonTaxableAmount(taxYear: number, members: number): Record<string, number> {
    const nonTaxableTable =
      taxYear < 1999
        ? { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 0 }
        : taxYear < 2020
          ? { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 0 }
          : { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 100000 };
    const nonTaxableFixed =
      members > 1 ? nonTaxableTable.baseFixed : 0 + nonTaxableTable.rate * members + nonTaxableTable.adjustment;
    const nonTaxableVar =
      members > 1 ? nonTaxableTable.baseVar : 0 + nonTaxableTable.rate * members + nonTaxableTable.adjustment;
    return { nonTaxableFixed: nonTaxableFixed, nonTaxableVar: nonTaxableVar };
  }
  const threshold = getNonTaxableAmount(taxYear, familyMembersNum);
  const nonTaxableFinal = nonTaxableAttr && taxableTotal <= 1350000;
  const nonTaxableFixed = taxableTotal <= threshold.nonTaxableFixed;
  const nonTaxableVar = carryOver <= threshold.nonTaxableVar;
  profiles.nonTaxable = { var: nonTaxableVar, fixed: nonTaxableFixed, final: nonTaxableFinal };
  return profiles;
}

export function setTaxable() {
  console.log('setTaxable');
  const applicantSalary = calcTaxable(system.taxYear, profiles.applicant.income.salary.amount);
  console.log('applicantSalary:', applicantSalary);
  const spouseSalary = calcTaxable(system.taxYear, profiles.spouse.income.salary.amount);

  //以前の機能との互換性
  profiles.applicant.taxable.salary.amount = applicantSalary.taxable;
  profiles.applicant.taxable.total = sumTaxable(profiles.applicant.taxable);
  profiles.applicant.taxable.carryOver.amount = getCarryover(profiles.applicant.taxable.total.amount, carryOvers);
  profiles.spouse.taxable.salary.amount = spouseSalary.taxable;
  profiles.spouse.taxable.total = sumTaxable(profiles.spouse.taxable);

  //非課税の設定
  setNonTaxable(profiles, system);

  //所得控除の計算
  const salaryExpensesSp = getSalaryExpensesSp(
    system.taxYear,
    profiles.other.salaryExpensesSp.amount,
    applicantSalary.deduction,
    applicantSalary.total
  );
  profiles.detail.salary.expenses.amount = applicantSalary.deduction + salaryExpensesSp;

  //退職所得控除の計算
  const serviceYears = profiles.other.serviceYears;
  const retirementDeduction = (() => {
    if (serviceYears === 0) {
      return 0;
    } else if (serviceYears <= 20) {
      return Math.max(400000 * serviceYears, 800000);
    } else {
      return (serviceYears - 20) * 700000 + 8000000;
    }
  })();
  if (profiles.other.multiRetirement === false) {
    function setRetirementExpenses(detail: Record<string, Record<string, Currency>>, key: string, deduction: number) {
      if (detail[key].revenue.amount > 0) {
        detail[key].expenses.amount = deduction;
      } else {
        detail[key].expenses.amount = 0;
      }
    }
    ['retirementLong', 'retirementShort', 'retirementOfficer'].forEach((key) => {
      setRetirementExpenses(profiles.detail, key, retirementDeduction);
    });
  }

  //所得金額調整控除の計算(1回目)
  const salaryAdjustment1 = getSalaryAdjustment(
    system.taxYear,
    profiles.detail.salary.revenue.amount,
    applicantSalary.taxable - salaryExpensesSp,
    0,
    (profiles.applicant.attributes.disability >= 2 ? 1 : 0) +
      (profiles.spouse.attributes.disability >= 2 ? 1 : 0) +
      profiles.dependent.disabilityP +
      profiles.dependent.disabilityLt,
    profiles.dependent.minors + profiles.dependent.specified
  );
  profiles.detail.salary.expenses.amount = applicantSalary.deduction + salaryExpensesSp + salaryAdjustment1.dependent;
  profiles.detail.salary.income.amount = profiles.detail.salary.revenue.amount - profiles.detail.salary.expenses.amount;

  //公的年金等に係る雑所得以外の所得金額の計算
  const exceptPension = aggregationPL('exceptPension', profiles.detail);
  console.log('exceptPension:', exceptPension);

  //公的年金等控除の計算
  const pension = calcTaxablePension(
    system.taxYear,
    profiles.detail.pension.income.amount,
    profiles.applicant.age,
    exceptPension
  );
  profiles.detail.pension.expenses.amount = pension.deduction;
  profiles.detail.pension.income.amount = pension.taxable;

  //所得金額調整控除の計算(2回目)
  const salaryAdjustment2 = getSalaryAdjustment(
    system.taxYear,
    profiles.detail.salary.revenue.amount,
    applicantSalary.taxable - salaryExpensesSp,
    pension.taxable,
    (profiles.applicant.attributes.disability >= 2 ? 1 : 0) +
      (profiles.spouse.attributes.disability >= 2 ? 1 : 0) +
      profiles.dependent.disabilityP +
      profiles.dependent.disabilityLt,
    profiles.dependent.minors + profiles.dependent.specified
  );
  profiles.detail.salary.expenses.amount =
    applicantSalary.deduction + salaryExpensesSp + salaryAdjustment2.dependent + salaryAdjustment2.doubleIncome;
  profiles.detail.salary.income.amount = profiles.detail.salary.revenue.amount - profiles.detail.salary.expenses.amount;
}
