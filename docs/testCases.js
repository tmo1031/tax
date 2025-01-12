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