import { RoundBy } from './functions';
export function calcTaxable(taxYear, income) {
    console.log('calcTaxable');
    function getValuesForYear(values, year, keys) {
        const result = {};
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
    function getIncomeTaxRate(taxYear, income) {
        var _a, _b;
        const taxValues = [
            { year: 2020, max10Per: 8500000, max5Per: Infinity },
            { year: 2017, max10Per: 10000000, max5Per: Infinity },
            { year: 2016, max10Per: 10000000, max5Per: 12000000 },
            { year: 2013, max10Per: 10000000, max5Per: 15000000 },
            { year: 1995, max10Per: 10000000, max5Per: Infinity },
        ];
        const values = getValuesForYear(taxValues, taxYear, ['max10Per', 'max5Per']);
        const maxTable = {
            fortyPer: 1800000,
            thirtyPer: 3600000,
            twentyPer: 6600000,
            tenPer: (_a = values.max10Per) !== null && _a !== void 0 ? _a : 0,
            fivePer: (_b = values.max5Per) !== null && _b !== void 0 ? _b : 0,
            zeroPer: Infinity,
        };
        const thresholds = [
            { limit: 0, discountRate: 0.5 },
            { limit: maxTable.fortyPer, discountRate: 0.4 },
            { limit: maxTable.thirtyPer, discountRate: 0.3 },
            { limit: maxTable.twentyPer, discountRate: 0.2 },
            { limit: maxTable.tenPer, discountRate: 0.1 },
            { limit: maxTable.zeroPer, discountRate: 0 },
        ];
        if (maxTable.fivePer !== null) {
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
                                    ? RoundBy(income, 4000) * incomeTaxSystem.rate - incomeTaxSystem.deduction
                                    : incomeTaxSystem.rate < 0.99
                                        ? RoundBy(income * incomeTaxSystem.rate, 1) - incomeTaxSystem.deduction
                                        : income - incomeTaxSystem.deduction;
    }
    else
        taxable = 0;
    return Math.max(taxable - incomeTaxSystem.offset, 0);
}
//# sourceMappingURL=calcTaxable.js.map