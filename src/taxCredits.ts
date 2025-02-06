import { roundBy, ceilBy, subtractCurrency /*, sumCurrency*/ } from './functions.js';
import { Estate, Currency, TaxReturn } from './objects.js';

export function getTaxAdjustment( // 調整控除
  personalDeductions: Record<string, Record<string, Currency>>,
  taxable: number,
  taxableDeducted: number
) {
  console.log('getTaxAdjustment');

  const delta =
    subtractCurrency(personalDeductions.basic.incomeTax, personalDeductions.basic.residentTax).amount +
    subtractCurrency(personalDeductions.personal.incomeTax, personalDeductions.personal.residentTax).amount +
    subtractCurrency(personalDeductions.dependent.incomeTax, personalDeductions.dependent.residentTax).amount +
    subtractCurrency(personalDeductions.spouse.incomeTax, personalDeductions.spouse.residentTax).amount;
  console.log('delta', delta);
  const caseLow = Math.min(delta, taxableDeducted);
  const caseHigh = Math.max(delta - (taxableDeducted - 2000000), 50000);
  const deltaAdjusted = taxable >= 25000000 ? 0 : taxableDeducted > 2000000 ? caseHigh : caseLow;

  return {
    adjustment: {
      incomeTax: { amount: 0 },
      residentTax: { amount: deltaAdjusted * 0.05 },
      cityTax: { amount: deltaAdjusted * 0.03 },
      prefTax: { amount: deltaAdjusted * 0.02 },
    },
    delta: delta,
  };
}

export function getDividendCredit(taxYear: number) {
  console.log('getDividendCredit');
  console.log('taxYear', taxYear);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getLoansCreditPre(estate: Estate, taxable: number) {
  //参考情報
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/code/bunya-tochi-tatemono.htm
  //https://www.nta.go.jp/law/joho-zeikaishaku/shotoku/shinkoku/shinkoku.htm
  // 少なくとも平成20年度の設例で、取得と増改築を併用可能と確認済み
  // 住宅取得等資金の贈与の特例は無視する
  // 既存住宅(中古)の取得は後で追加する
  const MoveInYear = estate.house.year;
  const MoveInMonth = estate.house.month;
  const houseAge = estate.house.age;
  //const renovationAge = estate.renovation.age;
  const balance = estate.loan.balance.amount;
  const qualityLevel = estate.case.quality; //長期優良住宅=4, それ以外=0
  const salesTax = estate.case.salesTax; //消費税増税対策
  const spH19Flag = estate.case.spH19; //税源移譲で所得税が減るため対策として創設された特例選択
  const spR1Flag = estate.case.spR1; //令和1年度税制改正の特別特例取得の判定
  const spR3Flag = estate.case.spR3; //令和3年度税制改正の特例特別特例取得の判定
  const parentingFlag = estate.case.parenting; //令和5年度税制での子育て世帯支援特例
  const spR6Flag = estate.case.spR6; //令和6年度税制改正での一般住宅への救済措置
  const spCovid19Flag = estate.case.covid19; //新型コロナウイルス感染症の影響による特例措置
  const housePrice = estate.house.price.amount;
  let LoanTable;
  if (MoveInYear < 1999) {
    LoanTable = [{ age: NaN, max: NaN, rate: NaN, incomeLimit: NaN }];
  } else if (MoveInYear < 2001 || (MoveInYear === 2001 && MoveInMonth < 7)) {
    //平成11年から平成13年前半の住宅ローン控除
    LoanTable = [
      { age: 6, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
      { age: 11, max: 50000000, rate: 0.0075, incomeLimit: 30000000, floor: 50 },
      { age: 15, max: 50000000, rate: 0.005, incomeLimit: 30000000, floor: 50 },
    ];
  } else if (MoveInYear <= 2004) {
    //平成13年後半から平成16年の住宅ローン控除
    LoanTable = [{ age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
  } else if (MoveInYear === 2005) {
    //平成17年の住宅ローン控除
    LoanTable = [
      { age: 8, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
      { age: 10, max: 40000000, rate: 0.005, incomeLimit: 30000000, floor: 50 },
    ];
  } else if (MoveInYear === 2006) {
    //平成18年の住宅ローン控除
    LoanTable = [
      { age: 7, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
      { age: 10, max: 30000000, rate: 0.005, incomeLimit: 30000000, floor: 50 },
    ];
  } else if (MoveInYear === 2007) {
    //平成19年の住宅ローン控除
    LoanTable =
      spH19Flag == true
        ? [
            { age: 10, max: 25000000, rate: 0.006, incomeLimit: 30000000, floor: 50 },
            { age: 15, max: 25000000, rate: 0.004, incomeLimit: 30000000, floor: 50 },
          ]
        : [
            { age: 6, max: 25000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
            { age: 10, max: 25000000, rate: 0.005, incomeLimit: 30000000, floor: 50 },
          ];
  } else if (MoveInYear === 2008) {
    //平成20年の住宅ローン控除
    LoanTable =
      spH19Flag == true
        ? [
            { age: 10, max: 20000000, rate: 0.006, incomeLimit: 30000000, floor: 50 },
            { age: 15, max: 20000000, rate: 0.004, incomeLimit: 30000000, floor: 50 },
          ]
        : [
            { age: 6, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
            { age: 10, max: 20000000, rate: 0.005, incomeLimit: 30000000, floor: 50 },
          ];
  } else if (qualityLevel === 0) {
    if (MoveInYear === 2009 || MoveInYear === 2010) {
      //平成21,22年の住宅ローン控除
      LoanTable = [{ age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2011) {
      //平成23年の住宅ローン控除
      LoanTable = [{ age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2012) {
      //平成24年の住宅ローン控除
      LoanTable = [{ age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2013 || (MoveInYear === 2014 && MoveInMonth < 4) || salesTax === 5) {
      //平成25年の住宅ローン控除
      LoanTable = [{ age: 10, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (
      (MoveInYear === 2014 && MoveInMonth >= 4) ||
      MoveInYear <= 2018 ||
      (MoveInYear === 2019 && MoveInMonth < 10)
    ) {
      //消費税8%の住宅ローン控除、特例適用なし
      LoanTable = [{ age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if ((MoveInYear === 2019 && MoveInMonth >= 10) || MoveInYear <= 2020 || spCovid19Flag === true) {
      //消費税10%に増税した際に一時的な特例あり
      LoanTable =
        spR1Flag == true
          ? [
              { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
              {
                age: 13,
                max: (Math.min(housePrice, 40000000) * 0.02) / 3,
                rate: 0.01,
                incomeLimit: 30000000,
                floor: 50,
              },
            ]
          : [{ age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if ((MoveInYear === 2021 || MoveInYear === 2022) && spR3Flag === true) {
      //コロナ対策で一時的な特例あり
      LoanTable = [
        { age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
        { age: 13, max: (Math.min(housePrice, 40000000) * 0.02) / 3, rate: 0.01, incomeLimit: 30000000, floor: 50 },
        { age: 10, max: 40000000, rate: 0.01, incomeLimit: 10000000, floor: 40 },
        { age: 13, max: (Math.min(housePrice, 40000000) * 0.02) / 3, rate: 0.01, incomeLimit: 10000000, floor: 40 },
      ];
    } else if ((MoveInYear === 2019 && MoveInMonth >= 10) || MoveInYear <= 2021) {
      //消費税8%(または10%)の住宅ローン控除
      LoanTable =
        salesTax > 5
          ? [{ age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }]
          : [{ age: 10, max: 20000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2022 || MoveInYear === 2023 || (MoveInYear === 2024 && parentingFlag === true)) {
      //令和4年以降の住宅ローン控除
      LoanTable = [{ age: 13, max: 30000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }];
    } else if (MoveInYear === 2024 || MoveInYear === 2025) {
      //令和6年以降の住宅ローン控除
      LoanTable =
        spR6Flag == true
          ? [{ age: 10, max: 20000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }]
          : [{ age: 10, max: 0, rate: 0.007, incomeLimit: 20000000, floor: 50 }];
    } else {
      LoanTable = [{ age: NaN, max: NaN, rate: NaN, incomeLimit: NaN }];
    }
  } else {
    if (MoveInYear === 2009 || MoveInYear === 2010 || MoveInYear === 2011) {
      //平成21,22,23年の住宅ローン控除、長期優良住宅
      LoanTable = [{ age: 10, max: 50000000, rate: 0.012, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2012) {
      //平成24年の住宅ローン控除、長期優良住宅
      LoanTable = [{ age: 10, max: 40000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2013 || (MoveInYear === 2014 && MoveInMonth < 4) || salesTax === 5) {
      //平成25年の住宅ローン控除、長期優良住宅
      LoanTable = [{ age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (
      ((MoveInYear === 2014 && MoveInMonth >= 4) || MoveInYear <= 2018 || (MoveInYear === 2019 && MoveInMonth < 10)) &&
      salesTax > 5
    ) {
      //消費税8%の住宅ローン控除、長期優良住宅
      LoanTable = [{ age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (
      ((MoveInYear === 2019 && MoveInMonth >= 10) || MoveInYear <= 2020) &&
      (spR1Flag == true || spCovid19Flag == true)
    ) {
      //消費税10%に増税した際に一時的な特例あり、長期優良住宅
      LoanTable = [
        { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
        { age: 13, max: (Math.min(housePrice, 50000000) * 0.02) / 3, rate: 0.01, incomeLimit: 30000000, floor: 50 },
      ];
    } else if ((MoveInYear === 2021 || MoveInYear === 2022) && spR3Flag == true) {
      LoanTable = [
        { age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 },
        { age: 13, max: (Math.min(housePrice, 50000000) * 0.02) / 3, rate: 0.01, incomeLimit: 30000000, floor: 50 },
        { age: 10, max: 50000000, rate: 0.01, incomeLimit: 10000000, floor: 40 },
        { age: 13, max: (Math.min(housePrice, 50000000) * 0.02) / 3, rate: 0.01, incomeLimit: 10000000, floor: 40 },
      ];
    } else if ((MoveInYear === 2019 && MoveInMonth >= 10) || MoveInYear <= 2021) {
      //消費税8%(または10%)の住宅ローン控除、長期優良住宅
      LoanTable =
        salesTax > 5
          ? [{ age: 10, max: 50000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }]
          : [{ age: 10, max: 30000000, rate: 0.01, incomeLimit: 30000000, floor: 50 }];
    } else if (MoveInYear === 2022 || MoveInYear === 2023 || (MoveInYear === 2024 && parentingFlag === true)) {
      //令和4年以降の住宅ローン控除
      LoanTable =
        qualityLevel === 1
          ? [{ age: 13, max: 40000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }]
          : qualityLevel === 2
            ? [{ age: 13, max: 45000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }]
            : [{ age: 13, max: 50000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }];
    } else if (MoveInYear === 2024 || MoveInYear === 2025) {
      //令和6年以降の住宅ローン控除
      LoanTable =
        qualityLevel === 1
          ? [{ age: 13, max: 30000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }]
          : qualityLevel === 2
            ? [{ age: 13, max: 35000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }]
            : [{ age: 13, max: 45000000, rate: 0.007, incomeLimit: 20000000, floor: 50 }];
    } else {
      LoanTable = [{ age: NaN, max: NaN, rate: NaN, incomeLimit: NaN }];
    }
  }
  /*
  const RenovationTable =
    MoveInYear < 2007
      ? [{ age: NaN, max: NaN, rate: NaN, incomeLimit: NaN }]
      : MoveInYear <= 2013 || (MoveInYear === 2014 && MoveInMonth < 4) || salesTax === 5
        ? [
            //平成19年以降の住宅ローン控除、特定増改築選択あり
            { age: 5, max: 10000000, rate: 0.01, maxSp: 2000000, rateSp: 0.02, incomeLimit: 30000000, floor: 50 },
          ]
        : ((MoveInYear === 2014 && MoveInMonth >= 4) || MoveInYear <= 2021) && salesTax > 5
          ? [
              //消費税増税後の住宅ローン控除、特定増改築選択あり
              { age: 5, max: 10000000, rate: 0.01, maxSp: 2500000, rateSp: 0.02, incomeLimit: 30000000, floor: 50 },
            ]
          : MoveInYear <= 2025
            ? [
                //令和4年以降
                { age: 10, max: 20000000, rate: 0.007, incomeLimit: 20000000, floor: 50 },
              ]
            : [
                //令和8年以降は未定
                { age: NaN, max: NaN, rate: NaN, incomeLimit: NaN },
              ];
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1216.htm
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1217.htm
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1218.htm
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1223.htm
  //https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1211-4.htm
*/

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

export function getLoansCredit(
  taxYear: number,
  estate: Estate,
  taxable: number,
  loanCredit: number,
  IncomeTaxPre: number,
  IncomeTaxOld: number
) {
  //住宅ローン控除
  //市区町村への控除申告をする場合の処理用にIncomeTaxOldを追加
  const paymentYear = taxYear + 1;
  const moveInYear = estate.house.year;
  const moveInMonth = estate.house.month;
  const transitional = estate.case.applyResidentTax;
  const salesTax = estate.case.salesTax; //消費税増税対策
  const incomeTax = Math.min(loanCredit, IncomeTaxPre);
  const residentTaxTable =
    moveInYear < 1999
      ? { rate: 0, max: 0 }
      : moveInYear === 2007 || moveInYear === 2008
        ? { rate: 0, max: 0 }
        : ((moveInYear === 2014 && moveInMonth >= 4) || (moveInYear >= 2015 && moveInYear === 2021)) && salesTax > 5
          ? { rate: 0.07, max: 136500 }
          : //通常の住民税住宅ローン控除
            { rate: 0.05, max: 97500 };

  if (paymentYear < 2008) {
    return {
      incomeTax: { amount: incomeTax },
      residentTax: { amount: 0 },
      cityTax: { amount: 0 },
      prefTax: { amount: 0 },
    };
  } else if (transitional === true && paymentYear >= 2008 && paymentYear <= 2016) {
    //平成20年度から28年度
    const adjustedCredit = Math.min(loanCredit, IncomeTaxOld);
    const residentTaxMax = Math.min(taxable * residentTaxTable.rate, residentTaxTable.max);
    const residentTax = Math.max(Math.min(adjustedCredit - IncomeTaxPre, residentTaxMax), 0);
    return {
      incomeTax: { amount: incomeTax },
      residentTax: { amount: residentTax },
      cityTax: { amount: residentTax * 0.6 },
      prefTax: { amount: residentTax * 0.4 },
    };
  } else {
    const residentTaxMax = Math.min(taxable * residentTaxTable.rate, residentTaxTable.max);
    const residentTax = Math.max(Math.min(loanCredit - IncomeTaxPre, residentTaxMax), 0);
    return {
      incomeTax: { amount: incomeTax },
      residentTax: { amount: residentTax },
      cityTax: { amount: residentTax * 0.6 },
      prefTax: { amount: residentTax * 0.4 },
    };
  }
}

export function getDonationCredit(
  taxYear: number,
  donation: Record<string, Currency>,
  taxReturn: TaxReturn,
  taxableTotal: number,
  taxPre: Record<string, Currency>,
  taxRate: number
) {
  console.log('getDonationCredit');
  console.log('taxYear', taxYear);
  console.log('donation', donation);
  console.log('taxReturn', taxReturn);
  const hometownTax = donation.hometownTax.amount;
  const communityChest = donation.communityChest.amount;
  //const both = donation.both.amount;
  const pref = Math.max(donation.pref.amount, 0);
  const city = Math.max(donation.city.amount, 0);
  const applyOneStop = taxReturn.applyOneStop;
  const politics = donation.politics.amount;
  const npo = donation.npo.amount;
  const publicInterest = donation.public.amount;
  const other = donation.other.amount + (applyOneStop ? 0 : donation.hometownTax.amount);
  const donationForIncomeTax = { politics: politics, npo: npo, public: publicInterest, other: other };
  const applyPolitics = taxReturn.applyPolitics;

  const limitByTaxable = taxableTotal * 0.3;
  const cityTotal = Math.min(hometownTax + communityChest + city, limitByTaxable);
  const prefTotal = Math.min(hometownTax + communityChest + pref, limitByTaxable);
  const deductible = { city: Math.max(cityTotal - 2000, 0), pref: Math.max(prefTotal - 2000, 0) };
  const base = { city: ceilBy(deductible.city * 0.1 * 0.6, 1), pref: ceilBy(deductible.pref * 0.1 * 0.4, 1) };

  function getHomeTownCredit(hometownTax: number, taxRate: number, taxPre: number, applyOneStop: boolean) {
    const deductible = Math.max(hometownTax - 2000, 0);
    const specialLimit = { city: ceilBy(taxPre * 0.2 * 0.6, 1), pref: ceilBy(taxPre * 0.2 * 0.4, 1) };
    //const base = { city: ceilBy(deductible * 0.1 * 0.6, 1), pref: ceilBy(deductible * 0.1 * 0.4, 1) };
    const specialPre = {
      city: ceilBy(deductible * (1 - (0.1 + taxRate)) * 0.6, 1),
      pref: ceilBy(deductible * (1 - (0.1 + taxRate)) * 0.4, 1),
    };
    const oneStop = { city: ceilBy(deductible * taxRate * 0.6, 1), pref: ceilBy(deductible * taxRate * 0.4, 1) };
    const special = {
      city: Math.min(specialPre.city, specialLimit.city),
      pref: Math.min(specialPre.pref, specialLimit.pref),
    };
    const total = {
      city: special.city + (applyOneStop ? oneStop.city : 0),
      pref: special.pref + (applyOneStop ? oneStop.pref : 0),
    };
    return total;
  }
  function getPolitics(donation: Record<string, number>, taxableTotal: number, taxPre: number) {
    const selfPay = 2000;
    const limitByTaxable = ceilBy(taxableTotal * 0.4, 1);
    let other = donation.other;
    const publicInterest = donation.public;
    const npo = donation.npo;
    const politics = donation.politics;

    function getPoliticsDetail(donation: number, deductionRate: number, shared: number, other: number) {
      const limit = Math.max(limitByTaxable - other, 0);
      const limitedDonation = Math.min(donation, limit);
      const basePay = Math.max(selfPay - other, 0);
      const limitByTaxPre = Math.max(roundBy(taxPre * 0.25, 1) - shared, 0);
      const deductible = Math.max(limitedDonation - basePay, 0);
      const credit = Math.min(roundBy(deductible * deductionRate, 100), limitByTaxPre);
      console.log('credit', credit);
      return credit;
    }

    const publicCredit = getPoliticsDetail(publicInterest, 0.4, 0, other);
    other += publicInterest;
    const npoCredit = getPoliticsDetail(npo, 0.4, publicCredit, other);
    other += npo;
    const politicsCredit = getPoliticsDetail(politics, 0.3, 0, other);
    const total = publicCredit + npoCredit + politicsCredit;
    return total;
  }

  const politicsCredit = applyPolitics ? getPolitics(donationForIncomeTax, taxableTotal, taxPre.incomeTax.amount) : 0;
  const hometownTaxCredit = getHomeTownCredit(hometownTax, taxRate, taxPre.residentTax.amount, applyOneStop);
  const cityTaxCredit = base.city + hometownTaxCredit.city;
  const prefTaxCredit = base.pref + hometownTaxCredit.pref;
  const residentTaxCredit = cityTaxCredit + prefTaxCredit;
  return {
    incomeTax: { amount: politicsCredit },
    residentTax: { amount: residentTaxCredit },
    cityTax: { amount: cityTaxCredit },
    prefTax: { amount: prefTaxCredit },
  };
}
export function getImprovementCredit(taxYear: number, improvement: number) {
  console.log('getImprovementCredit');
  console.log('taxYear', taxYear);
  console.log('improvement', improvement);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getDisasterCredit(taxYear: number, disaster: number) {
  console.log('getDisasterCredit');
  console.log('taxYear', taxYear);
  console.log('disaster', disaster);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getForeignTaxCredit(foreignTax: number, cityRatio: number) {
  //外国税額控除(未実装)
  return {
    incomeTax: { amount: 0 },
    residentTax: { amount: foreignTax },
    cityTax: { amount: foreignTax * cityRatio },
    prefTax: { amount: foreignTax * (1 - cityRatio) },
  };
}
export function getDividendRefund(dividend: number, cityRatio: number) {
  return {
    incomeTax: { amount: 0 },
    residentTax: { amount: dividend },
    cityTax: { amount: Math.floor(dividend * cityRatio) },
    prefTax: { amount: Math.ceil(dividend * (1 - cityRatio)) },
  };
}
export function getStockRefund(stock: number, cityRatio: number) {
  return {
    incomeTax: { amount: 0 },
    residentTax: { amount: stock },
    cityTax: { amount: Math.floor(stock * cityRatio) },
    prefTax: { amount: Math.ceil(stock * (1 - cityRatio)) },
  };
}
