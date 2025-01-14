export function calcTaxable(taxYear, income) {
    console.log('calcTaxable');

    function getIncomeTaxRate(taxYear) {
        const taxValues = [
            { year: 2020, max10Per: 8500000, max5Per: null },
            { year: 2017, max10Per: 10000000, max5Per: null },
            { year: 2016, max10Per: 10000000, max5Per: 12000000 },
            { year: 2013, max10Per: 10000000, max5Per: 15000000 },
            { year: 1995, max10Per: 10000000, max5Per: Infinity }
        ];

        const getValuesForYear = (values, year, keys) => {
            const result = {};
            for (const item of values) {
                if (year >= item.year) {
                    keys.forEach(key => {
                        result[key] = item[key];
                    });
                    break;
                }
            }
            return result;
        };

        const values = getValuesForYear(taxValues, taxYear, ['max10Per', 'max5Per', 'maxDeduction']);
        const maxTable = {
            fortyPer: 1800000,
            thirtyPer: 3600000,
            twentyPer: 6600000,
            tenPer: values.max10Per,
            fivePer: values.max5Per,
            zeroPer: Infinity,
        };

        let thresholds = [
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
            rate = (1 - thresholds[i].discountRate);
            if (income < limit) {
                for (let j = 0; j < i; j++) {
                    deductionSum += (thresholds[j].discountRate - thresholds[j+1].discountRate) * thresholds[j].limit;
                }
                return { rate: (1 - thresholds[i].discountRate), deduction: deductionSum, offset: (taxYear >= 2020) ?  -100000 : 0  };
            }
        }
        //console.log(rate, deductionSum);
        return { rate: rate, deduction: deductionSum, offset: (taxYear >= 2020) ? -100000 : 0 };
    }

    const incomeTaxSystem = getIncomeTaxRate(taxYear);

    let taxable;
    if (taxYear >= 1995) {
        taxable = 
            income < 1619000 ? income - 650000 :
            income < 1620000 ? 969000 :
            income < 1622000 ? 970000 :
            income < 1624000 ? 972000 :
            income < 1628000 ? 974000 :
            incomeTaxSystem.rate < 0.9 ? RoundBy(income, 4000) * incomeTaxSystem.rate - incomeTaxSystem.deduction :
            incomeTaxSystem.rate < 0.99 ? RoundBy(income * incomeTaxSystem.rate, 1) - incomeTaxSystem.deduction :
            income - incomeTaxSystem.deduction ;
    } else  taxable = 0;

    return Math.max(taxable - incomeTaxSystem.offset, 0);
}

export function getDisabilityDeduction (taxYear, disabilityLevel) {
    console.log('getDisabilityDeductions');
    const level = disabilityLevel;
    const DisabilityDeductionTable = (taxYear > 1982) ? {
        3: { incomeTax: 750000, residentTax: 530000 },
        2: { incomeTax: 400000, residentTax: 300000 },
        1: { incomeTax: 270000, residentTax: 260000 },
        0: { incomeTax: 0, residentTax: 0 }
    }: {
        null: { incomeTax: null, residentTax: null }, 
    };
    return DisabilityDeductionTable[level];
};

export function getSingleDeduction (taxYear, singleLevel, taxable) {
    console.log('getSingleDeductions');
    let level = taxable.total > 5000000 ? 0 : singleLevel;
    const SingleDeductionTable = (taxYear > 1951) ? {
        2: { incomeTax: 350000, residentTax: 300000 },
        1: { incomeTax: 270000, residentTax: 260000 },
        0: { incomeTax: 0, residentTax: 0 }
    }: {
        null: { incomeTax: null, residentTax: null }, 
    };
    return SingleDeductionTable[level];
};

export function getStudentDeduction (taxYear, studentLevel, taxable) {
    console.log('getStudentDeductions');
    let level = taxable.salary > 750000 || taxable.other > 100000 ? 0: studentLevel;
    const StudentDeductionTable = (taxYear > 1951) ? {
        1: { incomeTax: 270000, residentTax: 260000 },
        0: { incomeTax: 0, residentTax: 0 }
    }: {
        null: { incomeTax: null, residentTax: null }, 
    };
    return StudentDeductionTable[level];
};

export function getSpouseDeduction (taxYear, hasSpouse, applicantTotal, spouseTotal, spouseAge) {
    console.log('getSpouseDeduction');
    if (hasSpouse === 0) return { incomeTax: 0, residentTax: 0 };
    let deductions = { incomeTax: 380000, residentTax: 380000 };

    function setDeductions(deductions, incomeTaxDeduction, adjust) {
        deductions.incomeTax = incomeTaxDeduction;
        deductions.residentTax = incomeTaxDeduction - adjust;
    }
    function shrinkDeductions(deductions, rate, mode) {
        let shrinkValue = 
        mode === 'ceil' ? Math.ceil(deductions / 30000 * rate) * 10000:
        mode === 'round' ? Math.round(deductions / 30000 * rate) * 10000: deductions;
        return shrinkValue;
    }
    
    if (taxYear >= 1994){ // 1994年以降の税制改正, 2004年以降の税制改正
        const offset1 = taxYear >= 2018 ? 450000 : -1;
        const offset2 = taxYear >= 2020 ? 100000 : 0;
        const seniorDeduction = 100000;
        const minThreshold = 380000 + offset2; //380000 + 650000(基礎控除) が103万の壁
        const maxThreshold = taxYear >= 2018 ? 1230000 - offset1 : 760000; // 2018年以降は78万が上限
        const shrinkRate = taxYear < 2018 ? 3:
        applicantTotal <= 9000000 ? 3:
        applicantTotal <= 9500000 ? 2:
        applicantTotal <= 10000000 ? 1: 0; // 2018年以降は所得が1000万を超えると配偶者控除もなくなる

        const thresholds = (taxYear < 1994) ? [
            { limit: null, deductionI: null },
        ] : (taxYear < 2004) ? [
            { limit:  50000, deductionI: 760000, adjust: 100000 }, //50000 + 50000
            { limit: 100000, deductionI: 710000, adjust: 80000 }, //50000 + 30000
            { limit: 150000, deductionI: 660000, adjust: 80000 }, //50000 + 30000
            { limit: 200000, deductionI: 610000, adjust: 80000 }, //50000 + 30000
            { limit: 250000, deductionI: 560000, adjust: 80000 }, //50000 + 30000
            { limit: 300000, deductionI: 510000, adjust: 80000 }, //50000 + 30000
            { limit: 350000, deductionI: 460000, adjust: 80000 }, //50000 + 30000
            { limit: 380000, deductionI: 410000, adjust: 80000 }, //50000 + 30000
            { limit: 400000, deductionI: 380000, adjust: 50000 },
            { limit: 450000, deductionI: 360000, adjust: 30000 },
            { limit: 500000, deductionI: 310000, adjust: 10000 },
            { limit: 550000, deductionI: 260000, adjust: 10000 },
            { limit: 600000, deductionI: 210000, adjust: 10000 },
            { limit: 650000, deductionI: 160000, adjust: 10000 },
            { limit: 700000, deductionI: 110000, adjust: 10000 },
            { limit: 750000, deductionI: 60000, adjust: 10000 },
            { limit: maxThreshold, deductionI: 30000, adjust: 0 },
        ] : [
            { limit: 400000, deductionI: 380000, adjust: 50000 },
            { limit: 450000, deductionI: 360000, adjust: 30000 },
            { limit: 500000, deductionI: 310000, adjust: 0 },
            { limit: 550000, deductionI: 260000, adjust: 0 },
            { limit: 600000, deductionI: 210000, adjust: 0 },
            { limit: 650000, deductionI: 160000, adjust: 0 },
            { limit: 700000, deductionI: 110000, adjust: 0 },
            { limit: 750000, deductionI: 60000, adjust: 0 },
            { limit: maxThreshold, deductionI: 30000, adjust: 0 },
        ];

        let deductionIncome = 0;
        let adjust = 0;

        for (let i = 0; i < thresholds.length; i++) {
            if (spouseTotal <= (thresholds[i].limit + offset1 + offset2)) {
                deductionIncome = thresholds[i].deductionI;
                adjust = thresholds[i].adjust;
                break;
            }
        }                        
        if (spouseTotal <= minThreshold){
            adjust = (taxYear < 2004) ? adjust: 50000;
            if(spouseAge >= 70){ 
                deductionIncome += seniorDeduction;
                adjust = (taxYear < 2004) ? (adjust + seniorDeduction): seniorDeduction;
            }
        }

        if(shrinkRate < 3) {
            deductionIncome = shrinkDeductions(deductionIncome, shrinkRate, 'ceil');
            adjust = shrinkDeductions(adjust, shrinkRate, 'ceil');
        }
        setDeductions(deductions, deductionIncome, adjust);
    }
    return deductions;
};

export function getDependentDeduction (taxYear, dependent) {
    console.log('getDependentDeductions');
    const deductionTypes = [
        'Specified',
        'Elderly_LT',
        'Elderly',
        'Child',
        'Other',
        'Disability_LT',
        'Disability_P',
        'Disability_O'
    ];
    const deductionTable = (taxYear < 1999) ? { // 平成11年分から特定扶養親族の控除が拡大
        null: { incomeTax: null, residentTax: null },
    } : (taxYear < 2011) ?{ // 平成23年分から年少扶養親族（～15歳）に対する扶養控除が廃止
        Specified:  {incomeTax: 630000, residentTax: 450000 },// 特定扶養親族(16～22歳)
        Elderly_LT: {incomeTax: 580000, residentTax: 450000 },
        Elderly:    {incomeTax: 480000, residentTax: 380000 },
        Child:      {incomeTax: 380000, residentTax: 330000 },
        Other:      {incomeTax: 380000, residentTax: 330000 },
        Disability_LT: {incomeTax: 750000, residentTax: 530000 },
        Disability_P: {incomeTax: 400000, residentTax: 300000 },
        Disability_O: {incomeTax: 270000, residentTax: 260000 },
    } : {
        Specified:  {incomeTax: 630000, residentTax: 450000 },// 特定扶養親族(19～22歳)
        Elderly_LT: {incomeTax: 580000, residentTax: 450000 },
        Elderly:    {incomeTax: 480000, residentTax: 380000 },
        Child:      {incomeTax: 0, residentTax: 0 },
        Other:      {incomeTax: 380000, residentTax: 330000 },
        Disability_LT: {incomeTax: 750000, residentTax: 530000 },
        Disability_P: {incomeTax: 400000, residentTax: 300000 },
        Disability_O: {incomeTax: 270000, residentTax: 260000 },
    };

    function sumDeductions(deductions, dependent) {
        deductions.incomeTax += dependent.incomeTax;
        deductions.residentTax += dependent.residentTax;
    }

    let deductions = { incomeTax: 0, residentTax: 0 };
    deductionTypes.forEach(type => {
        for (let i = 0; i < dependent[type]; i++) {
            sumDeductions(deductions, deductionTable[type]);
        }
    });
    return deductions;
}

export function getBasicDeduction(taxYear, income) {
    console.log('getBasicDeduction');
    //console.log('taxYear:', taxYear);
    //console.log('income:', income);
    let level = (taxYear < 2020) ? 3:// 2019年以前は一律控除
                income <= 24000000 ? 3 : 
                income <= 24500000 ? 2 :
                income <= 25000000 ? 1 : 0; // 2020年の基礎控除で段階分けができた
    //console.log('level:', level);
    const BasicDeductionTable = (taxYear >= 2020) ? {
        3: { incomeTax: 480000, residentTax: 430000 },
        2: { incomeTax: 320000, residentTax: 270000 },
        1: { incomeTax: 160000, residentTax: 110000 },
        0: { incomeTax: 0, residentTax: 0 }
    }: (taxYear >= 1994) ? {
        3: { incomeTax: 380000, residentTax: 330000 }, 
    }: {
        null: { incomeTax: null, residentTax: null }, 
    };
    return BasicDeductionTable[level];
}

export function getTaxRate(taxYear, taxableIncome, taxableResident) {
    const paymentYear = taxYear +1;
    const reconstructionTax = (taxYear >= 2013 && taxYear <= 2037) ? 1.021 : 1; //復興所得税
    const incomeTaxRateTable = (taxYear < 1999) ? [
        { limit: null, adjustment: null },
    ] : (taxYear < 2007) ? [ //平成11年分から平成18年分の税構造
        { limit:  3300000, rate: 0.1, adjustment: 330000},
        { limit:  9000000, rate: 0.2, adjustment: 636000},
        { limit:  18000000, rate: 0.3, adjustment: 1230000},
        { limit:  Infinity, rate: 0.37, adjustment: 2490000},
    ] : (taxYear < 2015) ? [ //平成19年分から平成26年分の税構造
        { limit:  1950000, rate: 0.05, adjustment: 0},
        { limit:  3300000, rate: 0.1, adjustment: 97500},
        { limit:  6950000, rate: 0.2, adjustment: 427500},
        { limit:  9000000, rate: 0.3, adjustment: 636000},
        { limit:  18000000, rate: 0.33, adjustment: 1536000},
        { limit:  Infinity, rate: 0.4,  adjustment: 2796000},
    ] : [ //平成27年分以降の税構造
        { limit:  1950000, rate: 0.05, adjustment: 0},
        { limit:  3300000, rate: 0.1, adjustment: 97500},
        { limit:  6950000, rate: 0.2, adjustment: 427500},
        { limit:  9000000, rate: 0.3, adjustment: 636000},
        { limit:  18000000, rate: 0.33, adjustment: 1536000},
        { limit:  40000000, rate: 0.4,  adjustment: 2796000},
        { limit:  Infinity, rate: 0.45, adjustment: 4796000},
    ];
    const residentTaxRateTable = (paymentYear < 1999) ? [//平成9年度から平成10年度の税構造
        { limit:  2000000, rate: 0.05, city:0.03, pref: 0.02, adjustment: 0},
        { limit:  7000000, rate: 0.1, city:0.08, pref: 0.02, adjustment: 100000},
        { limit:  Infinity, rate: 0.15, city:0.12, pref: 0.03, adjustment: 450000},
    ] : (paymentYear < 2007) ? [ //平成11年度から平成18年度の税構造
        { limit:  2000000, rate: 0.05, city:0.03, pref: 0.02, adjustment: 0},
        { limit:  7000000, rate: 0.1, city:0.08, pref: 0.02, adjustment: 100000},
        { limit:  Infinity, rate: 0.13, city:0.10, pref: 0.03, adjustment: 310000},
    ] : [ //平成19年度以降は一律10%課税
        { limit:  Infinity, rate: 0.1, city:0.06, pref: 0.04, adjustment: 0},
    ];

    const fixedTaxTable = (paymentYear < 1996) ? {//平成8年度以降の標準税率を適用
        3: { cityTax: null, prefTax: null, ecoTax: null },
    } : (paymentYear < 2004) ? { //平成8年度以降平成16年度で人口段階別の税率区分が廃止されるまでの税制
        3: {cityTax:3000, prefTax: 1000, ecoTax: 0 },
        2: {cityTax:2500, prefTax: 1000, ecoTax: 0 },
        1: {cityTax:2000, prefTax: 1000, ecoTax: 0 },
    }: (paymentYear < 2014) ? { //平成16年度で人口段階別の税率区分が廃止、25年度まで
        3: {cityTax:3000, prefTax: 1000, ecoTax: 0 },
    }: (paymentYear < 2024) ? { //平成26年度で復興財源確保のため10年間加算(合計1000円)
        3: { cityTax: 3500, prefTax: 1500, ecoTax: 0 },
    }: { //令和6年度以降森林環境税(1000円)が創設
        3: { cityTax: 3000, prefTax: 1000, ecoTax: 1000},
    };

    const taxReductionTable = (taxYear < 1999) ? [ //定率減税の措置
        { incomeTaxReduceRate: 0, incomeTaxReduceLimit: 0, residentTaxReduceRate: 0, residentTaxReduceLimit: 0 },
    ]: (taxYear < 2005) ? [ //平成11年以降平成16年まで定率減税の措置
        { incomeTaxReduceRate: 0.2, incomeTaxReduceLimit: 250000, residentTaxReduceRate: 0.15, residentTaxReduceLimit: 40000 },
    ]: (taxYear === 2006) ? [ //平成18年個人所得税(課税対象平成17年)の定率減税が縮減
        { incomeTaxReduceRate: 0.2, incomeTaxReduceLimit: 250000, residentTaxReduceRate: 0.075, residentTaxReduceLimit: 20000 },
    ]: (taxYear === 2007) ? [ //定率減税縮減移行期間
        { incomeTaxReduceRate: 0.1, incomeTaxReduceLimit: 125000, residentTaxReduceRate: 0, residentTaxReduceLimit: 0 },
    ]: [ //平成19年分以降定率減税廃止
        { incomeTaxReduceRate: 0, incomeTaxReduceLimit: 0, residentTaxReduceRate: 0, residentTaxReduceLimit: 0 },
    ];

    //老年者控除
    //公的年金等控除
    //65歳以上の方に対する非課税措置

    function getIncomeTaxRate (taxable) {
        for (const bracket of incomeTaxRateTable) {
            if (taxable <= bracket.limit) {
                return { incomeTaxRate: bracket.rate * reconstructionTax, incomeTaxAdjustment : bracket.adjustment};
            }
        }
        return { incomeTaxRate: null, incomeTaxAdjustment : null };
    }

    function getResidentTaxRate (taxable) {
        for (const bracket of residentTaxRateTable) {
            if (taxable <= bracket.limit) {
                return { taxRateCity: bracket.city, taxRatePref: bracket.pref, residentTaxAdjustment : bracket.adjustment };
            }
        }
        return { taxRateCity: null, taxRatePref: null, residentTaxAdjustment : null };
    }

    function getFixedTax (taxYear) {
        const citySize = 3; //人口50万以上の市:3, 人口5万以上50万未満の市:2, その他の市及び町村:1
        const fixedTax = fixedTaxTable[citySize];
        return { cityTax: fixedTax.cityTax, prefTax: fixedTax.prefTax, ecoTax: fixedTax.ecoTax};
    }

    //console.log('taxableIncome:', taxableIncome);
    const { incomeTaxRate, incomeTaxAdjustment }
        = getIncomeTaxRate(taxableIncome);
    const { taxRateCity, taxRatePref, residentTaxAdjustment }
        = getResidentTaxRate(taxableResident);
    const { cityTax, prefTax, ecoTax } = getFixedTax();
    const residentTaxRate = taxRateCity + taxRatePref;
    const cityRatio = taxRateCity / residentTaxRate;

    const taxSystem = {
        rate: {incomeTax: incomeTaxRate, residentTax: residentTaxRate, cityTax:taxRateCity, prefTax: taxRatePref, cityRatio: cityRatio},
        adjustment: {incomeTax: incomeTaxAdjustment, residentTax: residentTaxAdjustment},
        fixed: {cityTax: cityTax, prefTax: prefTax, ecoTax: ecoTax},
    };

    return taxSystem;
}

export function RoundBy(income, base) {
    return Math.floor(income / base) * base;
}

export function getCasualtyLoss(taxYear, Loss) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getMedialDeduction(taxYear, Expenses, taxable) { //
    //セルフメディケーション税制（医療費控除の特例）は無視する
    const threshold = taxable < 2000000 ? taxable * 0.05 : 100000;
    const deduction = Expenses - threshold;
    return { incomeTax: deduction, residentTax: deduction };
}

export function getSocialDeduction(taxYear, SocialInsurance) {
    const deduction = SocialInsurance;//全額控除
    return { incomeTax: deduction , residentTax: deduction }; 
}

export function getMutualAidDeduction(taxYear, MutualAid) {
    const deduction = MutualAid;//全額控除
    return { incomeTax: deduction , residentTax: deduction }; 
}

export function getLifeInsuranceDeduction(taxYear, Insurance) {
    const InsuranceDeductionTable = {
        NewIncome: [
            { limit: 20000, rate: 1, adjustment: 0},
            { limit: 40000, rate: 0.5, adjustment: 10000},
            { limit: 80000, rate: 0.25, adjustment: 20000},
            { limit: Infinity, rate: 0, adjustment: 40000},
        ],
        OldIncome: [
            { limit: 25000, rate: 1, adjustment: 0},
            { limit: 50000, rate: 0.5, adjustment: 12500},
            { limit: 100000, rate: 0.25, adjustment: 25000},
            { limit: Infinity, rate: 0, adjustment: 50000},
        ],
        NewResident: [
            { limit: 12000, rate: 1, adjustment: 0},
            { limit: 32000, rate: 0.5, adjustment: 6000},
            { limit: 56000, rate: 0.25, adjustment: 14000},
            { limit: Infinity, rate: 0, adjustment: 28000},
        ],
        OldResident: [
            { limit: 15000, rate: 1, adjustment: 0},
            { limit: 40000, rate: 0.5, adjustment: 7500},
            { limit: 70000, rate: 0.25, adjustment: 17500},
            { limit: Infinity, rate: 0, adjustment: 35000},
        ],
    };
    const maxDeduction = {
        Income: 40000,
        Resident: 28000,
    };

    function getInsuranceDeduction(deductionType, amount) {
        const table = InsuranceDeductionTable[deductionType];
        if (!table) {
            throw new Error(`Deduction type ${deductionType} not found`);
        }    
        for (const entry of table) {
            if (amount <= entry.limit) {
                return amount * entry.rate + entry.adjustment;
            }
        }
        return 0; // デフォルトの控除額（該当する範囲がない場合）
    }

    function getBoth(type, newInsurance, oldInsurance) {
        const oldDeduction = type === 'Income' ?
            getInsuranceDeduction('OldIncome', oldInsurance) :
            getInsuranceDeduction('OldResident', oldInsurance);
        const newDeduction = type === 'Income' ?
            getInsuranceDeduction('NewIncome', newInsurance) :
            getInsuranceDeduction('NewResident', newInsurance);
        const bothDeduction = newDeduction + oldDeduction;

        if (newInsurance > 0 && oldInsurance>0 ) {
            return Math.min(Math.max(oldDeduction, bothDeduction), maxDeduction[type]);
        } else if (newInsurance > 0) return newDeduction;
        else return oldDeduction;
    }

    const lifeIncome = getBoth('Income', Insurance.Life_New, Insurance.Life_Old);
    const annuityIncome = getBoth('Income', Insurance.Annuity_New, Insurance.Annuity_Old);
    const healthIncome = getInsuranceDeduction('NewIncome', Insurance.Health);
    const incomeTaxDeduction = Math.min(lifeIncome + annuityIncome + healthIncome,120000);
    const lifeResident = getBoth('Resident', Insurance.Life_New, Insurance.Life_Old);
    const annuityResident = getBoth('Resident', Insurance.Annuity_New, Insurance.Annuity_Old);
    const healthResident = getInsuranceDeduction('NewResident', Insurance.Health);
    const residentTaxDeduction = Math.min(lifeResident + annuityResident + healthResident,70000);
    return { incomeTax: incomeTaxDeduction, residentTax: residentTaxDeduction };
}

export function getEInsuranceDeduction(taxYear, Insurance) {
    const EInsuranceDeductionTable = {
        NewIncome: [
            { limit: 50000, rate: 1, adjustment: 0},
            { limit: Infinity, rate: 0, adjustment: 50000},
        ],
        OldIncome: [
            { limit: 10000, rate: 1, adjustment: 0},
            { limit: 20000, rate: 0.5, adjustment: 5000},
            { limit: Infinity, rate: 0, adjustment: 15000},
        ],
        NewResident: [
            { limit: 50000, rate: 0.5, adjustment: 0},
            { limit: Infinity, rate: 0, adjustment: 25000},
        ],
        OldResident: [
            { limit: 5000, rate: 1, adjustment: 0},
            { limit: 15000, rate: 0.5, adjustment: 2500},
            { limit: Infinity, rate: 0, adjustment: 10000},
        ],
    };
    function getEInsuranceDeduction(deductionType, amount) {
        const table = EInsuranceDeductionTable[deductionType];
        if (!table) {
            throw new Error(`Deduction type ${deductionType} not found`);
        }    
        for (const entry of table) {
            if (amount <= entry.limit) {
                return amount * entry.rate + entry.adjustment;
            }
        }
        return 0; // デフォルトの控除額（該当する範囲がない場合）
    }
    function getBoth(type, newInsurance, oldInsurance) {
        const oldDeduction = type === 'Income' ?
            getEInsuranceDeduction('OldIncome', oldInsurance) :
            getEInsuranceDeduction('OldResident', oldInsurance);
        const newDeduction = type === 'Income' ?
            getEInsuranceDeduction('NewIncome', newInsurance) :
            getEInsuranceDeduction('NewResident', newInsurance);
        const bothDeduction = newDeduction + oldDeduction;

        if (newInsurance > 0 && oldInsurance>0 ) {
            return Math.min(Math.max(oldDeduction, bothDeduction), maxDeduction[type]);
        } else if (newInsurance > 0) return newDeduction;
        else return oldDeduction;
    }

    const EarthquakeIncome = getBoth('Income', Insurance.Earthquake_New, Insurance.Earthquake_Old);
    const incomeTaxDeduction = Math.min(EarthquakeIncome, 50000);
    const EarthquakeResident = getBoth('Resident', Insurance.Earthquake_New, Insurance.Earthquake_Old);
    const residentTaxDeduction = Math.min(EarthquakeResident, 25000);
    return { incomeTax: incomeTaxDeduction, residentTax: residentTaxDeduction };
}

export function getDonationDeduction(taxYear, Donations) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getDividendCredit(taxYear) {// 配当控除の計算が難しいので保留
    return { incomeTax: 0, residentTax: 0 };
}

export function getLoansCreditPre(estate, taxable) {
    //参考情報
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/code/bunya-tochi-tatemono.htm
    //https://www.nta.go.jp/law/joho-zeikaishaku/shotoku/shinkoku/shinkoku.htm
    // 少なくとも平成20年度の設例で、取得と増改築を併用可能と確認済み
    // 住宅取得等資金の贈与の特例は無視する
    // 既存住宅(中古)の取得は後で追加する
    const MoveInYear = estate.house.year;
    const MoveInMonth = estate.house.month;
    const houseAge = estate.house.age;
    const renovationAge = estate.renovation.age;
    const balance = estate.loan.balance
    const QualityLevel = estate.case.Quality; //長期優良住宅=4, それ以外=0
    const SalesTax = estate.case.SalesTax; //消費税増税対策
    const SpH19Flag = estate.case.SpH19; //税源移譲で所得税が減るため対策として創設された特例選択
    const SpR1Flag = estate.case.SpR1; //令和1年度税制改正の特別特例取得の判定
    const SpR3Flag = estate.case.SpR3; //令和3年度税制改正の特例特別特例取得の判定
    const ParentingFlag = estate.case.Parenting; //令和5年度税制での子育て世帯支援特例
    const SpR6Flag = estate.case.SpR6; //令和6年度税制改正での一般住宅への救済措置
    const SpCovid19Flag = estate.case.Covid19; //新型コロナウイルス感染症の影響による特例措置
    const housePrice = estate.house.price;
    let LoanTable;
    if (MoveInYear < 1999) {
        LoanTable = [
            { age: null, max: null, rate: null, incomeLimit: null},
        ];
    } else if (MoveInYear < 2001 || (MoveInYear === 2001 && MoveInMonth <7 )) {
        //平成11年から平成13年前半の住宅ローン控除
        LoanTable = [ 
            { age: 6, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            { age: 11, max: 50000000, rate: 0.0075, incomeLimit: 30000000, floor: 50},
            { age: 15, max: 50000000, rate: 0.005, incomeLimit: 30000000, floor: 50},
        ]; 
    } else if (MoveInYear <= 2004) {
        //平成13年後半から平成16年の住宅ローン控除
        LoanTable = [
            { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
        ];
    } else if (MoveInYear === 2005) {
        //平成17年の住宅ローン控除
        LoanTable = [
            { age: 8, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            { age: 10, max: 40000000, rate: 0.005, incomeLimit: 30000000, floor: 50},
        ];
    } else if (MoveInYear === 2006) {
        //平成18年の住宅ローン控除
        LoanTable = [
            { age: 7, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            { age: 10, max: 30000000, rate: 0.005, incomeLimit: 30000000, floor: 50},
        ];
    } else if (MoveInYear === 2007) {
        //平成19年の住宅ローン控除
        LoanTable = SpH19Flag == true ? [
            { age: 10, max: 25000000, rate: 0.006, incomeLimit: 30000000, floor: 50},
            { age: 15, max: 25000000, rate: 0.004, incomeLimit: 30000000, floor: 50},
        ] : [
            { age: 6, max: 25000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            { age: 10, max: 25000000, rate: 0.005, incomeLimit: 30000000, floor: 50},
        ];
    } else if (MoveInYear === 2008) {
        //平成20年の住宅ローン控除
        LoanTable = SpH19Flag == true ? [
            { age: 10, max: 20000000, rate: 0.006, incomeLimit: 30000000, floor: 50},
            { age: 15, max: 20000000, rate: 0.004, incomeLimit: 30000000, floor: 50},
        ] : [
            { age: 6, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            { age: 10, max: 20000000, rate: 0.005, incomeLimit: 30000000, floor: 50},
        ];
    } else if (QualityLevel === 0) {
        if (MoveInYear === 2009 || MoveInYear === 2010) {
        //平成21,22年の住宅ローン控除
            LoanTable = [
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ]
        } else if (MoveInYear === 2011) {
        //平成23年の住宅ローン控除
            LoanTable = [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ]
        } else if (MoveInYear === 2012) {
        //平成24年の住宅ローン控除
            LoanTable = [
                { age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50}, 
            ];
        } else if (MoveInYear === 2013 || (MoveInYear === 2014 && MoveInMonth <4)|| SalesTax === 5) {
        //平成25年の住宅ローン控除
            LoanTable = [
                { age: 10, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if ((MoveInYear === 2014 && MoveInMonth >=4) || MoveInYear <= 2018 || (MoveInYear === 2019 && MoveInMonth < 10)) {
        //消費税8%の住宅ローン控除、特例適用なし
            LoanTable = [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if ((MoveInYear === 2019 && MoveInMonth >=10) || MoveInYear <= 2020 || SpCovid19Flag === true) {
        //消費税10%に増税した際に一時的な特例あり
            LoanTable = SpR1Flag == true ? [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 13, max: Math.min(housePrice, 40000000)*0.02/3, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ] : [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if ((MoveInYear === 2021 || MoveInYear === 2022) && SpR3Flag === true) {
        //コロナ対策で一時的な特例あり
            LoanTable = [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 13, max: Math.min(housePrice, 40000000)*0.02/3, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 10000000, floor: 40},
                { age: 13, max: Math.min(housePrice, 40000000)*0.02/3, rate: 0.01, incomeLimit: 10000000, floor: 40},
            ];
        } else if ((MoveInYear === 2019 && MoveInMonth >=10) || MoveInYear <= 2021) {
        //消費税8%(または10%)の住宅ローン控除
            LoanTable = (SalesTax > 5) ? [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ] : [
                { age: 10, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if (MoveInYear === 2022 || MoveInYear === 2023 || (MoveInYear === 2024 && ParentingFlag === true)) {
            //令和4年以降の住宅ローン控除
            LoanTable = [
                { age: 13, max: 30000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ];
        } else if ((MoveInYear === 2024 || MoveInYear === 2025)) {
            //令和6年以降の住宅ローン控除
            LoanTable = SpR6Flag == true ? [
                { age: 10, max: 20000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ] : [
                { age: 10, max: 0, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ];
        } else {
            LoanTable = [        
                { age: null, max: null, rate: null, incomeLimit: null},
            ];
        }
    } else {
        if (MoveInYear === 2009 || MoveInYear === 2010 || MoveInYear === 2011) {
            //平成21,22,23年の住宅ローン控除、長期優良住宅
            LoanTable = [
                { age: 10, max: 50000000, rate: 0.012, incomeLimit: 30000000, floor: 50},
            ];
        } else if (MoveInYear === 2012) {
            //平成24年の住宅ローン控除、長期優良住宅
            LoanTable = [
                { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if (MoveInYear === 2013 || (MoveInYear === 2014 && MoveInMonth <4) || SalesTax === 5) {
            //平成25年の住宅ローン控除、長期優良住宅
            LoanTable = [
                { age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if (((MoveInYear === 2014 && MoveInMonth >=4) || MoveInYear <= 2018 || (MoveInYear === 2019 && MoveInMonth < 10)) && SalesTax > 5) {
            //消費税8%の住宅ローン控除、長期優良住宅
            LoanTable = [
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if (((MoveInYear === 2019 && MoveInMonth >=10) || MoveInYear <= 2020) && (SpR1Flag == true || SpCovid19Flag == true)) {
            //消費税10%に増税した際に一時的な特例あり、長期優良住宅
            LoanTable = [
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 13, max: Math.min(housePrice, 50000000)*0.02/3, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if ((MoveInYear === 2021 || MoveInYear === 2022) && SpR3Flag == true) {
            LoanTable = [
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 13, max: Math.min(housePrice, 50000000)*0.02/3, rate: 0.01, incomeLimit: 30000000, floor: 50},
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 10000000, floor: 40},
                { age: 13, max: Math.min(housePrice, 50000000)*0.02/3, rate: 0.01, incomeLimit: 10000000, floor: 40},
            ];
        } else if ((MoveInYear === 2019 && MoveInMonth >=10) || MoveInYear <= 2021) {
            //消費税8%(または10%)の住宅ローン控除、長期優良住宅
            LoanTable = (SalesTax > 5) ? [
                { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ] : [
                { age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50},
            ];
        } else if (MoveInYear === 2022 || MoveInYear === 2023 || (MoveInYear === 2024 && ParentingFlag === true)) {
            //令和4年以降の住宅ローン控除
            LoanTable = (QualityLevel === 1) ? [
                { age: 13, max: 40000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ] : (QualityLevel === 2) ? [
                { age: 13, max: 45000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ] : [
                { age: 13, max: 50000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ];
        } else if ((MoveInYear === 2024 || MoveInYear === 2025)) {
            //令和6年以降の住宅ローン控除
            LoanTable = (QualityLevel === 1) ? [
                { age: 13, max: 30000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ] : (QualityLevel === 2) ? [
                { age: 13, max: 35000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ] : [
                { age: 13, max: 45000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
            ];
        } else {
            LoanTable = [
                { age: null, max: null, rate: null, incomeLimit: null},
            ];
        }
    }
    const RenovationTable = (MoveInYear < 2007) ? [
        { age: null, max: null, rate: null, incomeLimit: null},
    ] : (MoveInYear <= 2013 || (MoveInYear === 2014 && MoveInMonth <4)|| SalesTax === 5) ? [ //平成19年以降の住宅ローン控除、特定増改築選択あり
        { age: 5, max: 10000000, rate: 0.01, maxSp: 2000000, rateSp: 0.02, incomeLimit: 30000000, floor: 50},
    ] : (((MoveInYear === 2014 && MoveInMonth >=4)|| (MoveInYear <= 2021)) && SalesTax > 5) ? [ //消費税増税後の住宅ローン控除、特定増改築選択あり
        { age: 5, max: 10000000, rate: 0.01, maxSp: 2500000, rateSp: 0.02, incomeLimit: 30000000, floor: 50},
    ] : (MoveInYear <= 2025) ? [ //令和4年以降
        { age: 10, max: 20000000, rate: 0.007, incomeLimit: 20000000, floor: 50},
    ] : [ //令和8年以降は未定
        { age: null, max: null, rate: null, incomeLimit: null},
    ];
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1216.htm
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1217.htm
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1218.htm
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1223.htm
    //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1211-4.htm

    console.log('LoanTable:', LoanTable);
    for (const entry of LoanTable) {
        if (taxable > entry.incomeLimit) {
            return 0;
        } else if (houseAge <= entry.age) {
            return Math.min(balance * entry.rate, entry.max);
        }
    }
    return 0;
}

export function getLoansCredit(taxYear, estate, taxable, loanCredit, IncomeTaxPre, IncomeTaxOld) {
    //住宅ローン控除
    //市区町村への控除申告をする場合の処理用にIncomeTaxOldを追加
    const paymentYear = taxYear +1;
    const MoveInYear = estate.house.year;
    const MoveInMonth = estate.house.month;
    const transitional = estate.case.ApplyResidentTax;
    const SalesTax = estate.case.SalesTax; //消費税増税対策
    const incomeTax = Math.min(loanCredit, IncomeTaxPre);
    const residentTaxTable = (MoveInYear < 1999) ? 
        { rate: 0, max: 0}
    : ( MoveInYear === 2007 || MoveInYear === 2008 ) ?
        { rate: 0, max: 0}
    : (((MoveInYear === 2014 && MoveInMonth >=4) || (MoveInYear >= 2015 && MoveInYear === 2021)) && SalesTax > 5) ?
        { rate: 0.07, max: 136500}
    : //通常の住民税住宅ローン控除
        { rate: 0.05, max: 97500};

    if (paymentYear < 2008) {
        return { incomeTax: incomeTax, residentTax: 0 };
    } else if(transitional === true && (paymentYear >= 2008 && paymentYear <= 2016)) { //平成20年度から28年度
        const adjustedCredit = Math.min(loanCredit, IncomeTaxOld);
        const residentTaxMax = Math.min(taxable * residentTaxTable.rate, residentTaxTable.max);
        const residentTax = Math.max(Math.min(adjustedCredit - IncomeTaxPre, residentTaxMax), 0);
        return { incomeTax: incomeTax, residentTax: residentTax };
    } else {
        const residentTaxMax = Math.min(taxable * residentTaxTable.rate, residentTaxTable.max);
        const residentTax = Math.max(Math.min(loanCredit - IncomeTaxPre, residentTaxMax), 0);
        return { incomeTax: incomeTax, residentTax: residentTax };
    }
}

export function getDonationCredit(taxYear, Donations) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getImprovementCredit(taxYear, Improvement) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getDisasterCredit(taxYear, DisasterReduction) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getForeignTaxCredit(taxYear, ForeignTax) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getDividendRefund(taxYear, Dividend_J) {
    return { incomeTax: 0, residentTax: 0 };
}

export function getStockRefund(taxYear, Stock_J) {
    return { incomeTax: 0, residentTax: 0 };
}