export const testCasesIncome = [
    { year: 2020, income: 1000000, expected: 450000 },
    { year: 2020, income: 550000, expected: 0 },
    { year: 2020, income: 1618999, expected: 1068999 },
    { year: 2020, income: 1619000, expected: 1069000 },
    { year: 2020, income: 1620000, expected: 1070000 },
    { year: 2020, income: 1622000, expected: 1072000 },
    { year: 2020, income: 1624000, expected: 1074000 },
    { year: 2020, income: 1628000, expected: 1076800 },
    { year: 2020, income: 1650000, expected: 1088800 },
    { year: 2020, income: 1800000, expected: 1180000 },
    { year: 2020, income: 3600000, expected: 2440000 },
    { year: 2020, income: 6600000, expected: 4840000 },
    { year: 2020, income: 8500000, expected: 6550000 },
    { year: 2020, income: 10000000, expected: 8050000 },
    { year: 2020, income: 12000000, expected: 10050000 },
    { year: 2020, income: 20000000, expected: 18050000 },
    { year: 2017, income: 1000000, expected: 350000 },
    { year: 2017, income: 8500000, expected: 6450000 },
    { year: 2017, income: 10000000, expected: 7800000 },
    { year: 2017, income: 12000000, expected: 9800000 },
    { year: 2017, income: 20000000, expected: 17800000 },
    { year: 2016, income: 1000000, expected: 350000 },
    { year: 2016, income: 10000000, expected: 7800000 },
    { year: 2016, income: 15000000, expected: 12700000 },
    { year: 2013, income: 1000000, expected: 350000 },
    { year: 2013, income: 10000000, expected: 7800000 },
    { year: 2013, income: 15000000, expected: 12550000 },
    { year: 2013, income: 20000000, expected: 17550000 },
    { year: 1995, income: 1000000, expected: 350000 },
    { year: 1995, income: 10000000, expected: 7800000 },
    { year: 1995, income: 15000000, expected: 12550000 },
    { year: 1995, income: 20000000, expected: 17300000 },
];

export const testCasesSpouse = [
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 2000000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 2000000, spouseAge: 70, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 100000, spouseAge: 70, expected: { incomeTax: 480000, residentTax: 380000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 8990000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9010000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9490000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9500000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9510000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9990000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2020, hasSpouse: 1, applicantTotal:10000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2020, hasSpouse: 1, applicantTotal:10010000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 480000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9100000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9600000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2020, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 360000, residentTax: 330000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9100000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 240000, residentTax: 220000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 9600000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 120000, residentTax: 110000 } },
    { year: 2020, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1320000, spouseAge: 69, expected: { incomeTax: 30000, residentTax: 30000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1330000, spouseAge: 69, expected: { incomeTax: 30000, residentTax: 30000 } },
    { year: 2020, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1340000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 2000000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 2000000, spouseAge: 70, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 100000, spouseAge: 70, expected: { incomeTax: 480000, residentTax: 380000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 8990000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9010000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9490000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9500000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 220000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9510000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9990000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2019, hasSpouse: 1, applicantTotal:10000000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 130000, residentTax: 110000 } },
    { year: 2019, hasSpouse: 1, applicantTotal:10010000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 480000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 310000, residentTax: 310000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9100000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 210000, residentTax: 210000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9600000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 110000, residentTax: 110000 } },
    { year: 2019, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 950000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 8900000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 260000, residentTax: 260000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9100000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 180000, residentTax: 180000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 9600000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 90000, residentTax: 90000 } },
    { year: 2019, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 970000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1220000, spouseAge: 69, expected: { incomeTax: 30000, residentTax: 30000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1230000, spouseAge: 69, expected: { incomeTax: 30000, residentTax: 30000 } },
    { year: 2019, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 1240000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 380000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 390000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 400000, spouseAge: 69, expected: { incomeTax: 360000, residentTax: 330000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 430000, spouseAge: 69, expected: { incomeTax: 360000, residentTax: 330000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 740000, spouseAge: 69, expected: { incomeTax: 60000, residentTax: 60000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 750000, spouseAge: 69, expected: { incomeTax: 30000, residentTax: 30000 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 760000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2017, hasSpouse: 1, applicantTotal: 1000000, spouseTotal: 770000, spouseAge: 69, expected: { incomeTax: 0, residentTax: 0 } },
    { year: 2017, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 100000, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    { year: 2017, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 0, spouseAge: 69, expected: { incomeTax: 380000, residentTax: 330000 } },
    //{ year: 2003, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 0, spouseAge: 69, expected: { incomeTax: 76000, residentTax: 76000 } },// エラー吐く用のテストケース
    { year: 2003, hasSpouse: 1, applicantTotal:10100000, spouseTotal: 0, spouseAge: 69, expected: { incomeTax: 760000, residentTax: 660000 } },
];

export const testCasesLoan = [
    { estate: {
        house: {year:2001, month: 1, age:8,
            price: 20000000, price_Sp: null,
            resident: 100, debt: 100,},
        land: {year:2001, month: 1, age:8,
            price: 20000000, price_Sp: null,
            resident: 100, debt: 100,},
        renovation: {year:null, month: null, age:null,
            price: null, price_Sp: null,
            resident: null, debt: null,},
        case: {
            Quality: 0, //長期優良住宅=4, 認定低炭素住宅=3, ZEH水準省エネ住宅=2, 省エネ基準適合住宅=1, 一般住宅=0
            SalesTax: 0, //消費税増税対策
            SpH19: false, //税源移譲で所得税が減るため対策として創設された特例選択
            SpR1: false, //令和1年度税制改正の特別特例取得の判定
            SpR3: false, //令和3年度税制改正の特例特別特例取得の判定
            Parenting: false, //令和5年度税制での子育て世帯支援特例
            SpR6: false, //令和6年度税制改正での一般住宅への救済措置
            Covid19: false, //新型コロナウイルス感染症の影響による特例措置
        }},
    Loans: {balance: 10000000},
    taxable: 8000000,
    expected: 75000 },
    { estate: {
        house: {year:2020, month: 1, age:3,
            price: 20000000, price_Sp: null,
            resident: 100, debt: 100,},
        land: {year:2020, month: 1, age:3,
            price: 20000000, price_Sp: null,
            resident: 100, debt: 100,},
        renovation: {year:null, month: null, age:null,
            price: null, price_Sp: null,
            resident: null, debt: null,},
        case: {
            Quality: 0, //長期優良住宅=4, 認定低炭素住宅=3, ZEH水準省エネ住宅=2, 省エネ基準適合住宅=1, 一般住宅=0
            SalesTax: 10, //消費税増税対策
            SpH19: null, //税源移譲で所得税が減るため対策として創設された特例選択
            SpR1: true, //令和1年度税制改正の特別特例取得の判定
            SpR3: null, //令和3年度税制改正の特例特別特例取得の判定
            Parenting: null, //令和5年度税制での子育て世帯支援特例
            SpR6: null, //令和6年度税制改正での一般住宅への救済措置
            Covid19: null, //新型コロナウイルス感染症の影響による特例措置
        }},
    Loans: {balance: 36000000},
    taxable: 8000000,
    expected: 360000 },

];