export function getTaxRate(taxYear: number, taxableIncome: number, taxableResident: number) {
  const paymentYear = taxYear + 1;
  const reconstructionTax = taxYear >= 2013 && taxYear <= 2037 ? 1.021 : 1; //復興所得税
  const incomeTaxRateTable =
    taxYear < 1999
      ? [{ limit: Infinity, rate: NaN, adjustment: NaN }]
      : taxYear < 2007
        ? [
            //平成11年分から平成18年分の税構造
            { limit: 3300000, rate: 0.1, adjustment: 330000 },
            { limit: 9000000, rate: 0.2, adjustment: 636000 },
            { limit: 18000000, rate: 0.3, adjustment: 1230000 },
            { limit: Infinity, rate: 0.37, adjustment: 2490000 },
          ]
        : taxYear < 2015
          ? [
              //平成19年分から平成26年分の税構造
              { limit: 1950000, rate: 0.05, adjustment: 0 },
              { limit: 3300000, rate: 0.1, adjustment: 97500 },
              { limit: 6950000, rate: 0.2, adjustment: 427500 },
              { limit: 9000000, rate: 0.3, adjustment: 636000 },
              { limit: 18000000, rate: 0.33, adjustment: 1536000 },
              { limit: Infinity, rate: 0.4, adjustment: 2796000 },
            ]
          : [
              //平成27年分以降の税構造
              { limit: 1950000, rate: 0.05, adjustment: 0 },
              { limit: 3300000, rate: 0.1, adjustment: 97500 },
              { limit: 6950000, rate: 0.2, adjustment: 427500 },
              { limit: 9000000, rate: 0.3, adjustment: 636000 },
              { limit: 18000000, rate: 0.33, adjustment: 1536000 },
              { limit: 40000000, rate: 0.4, adjustment: 2796000 },
              { limit: Infinity, rate: 0.45, adjustment: 4796000 },
            ];
  const residentTaxRateTable =
    paymentYear < 1999
      ? [
          //平成9年度から平成10年度の税構造
          { limit: 2000000, rate: 0.05, city: 0.03, pref: 0.02, adjustment: 0 },
          { limit: 7000000, rate: 0.1, city: 0.08, pref: 0.02, adjustment: 100000 },
          { limit: Infinity, rate: 0.15, city: 0.12, pref: 0.03, adjustment: 450000 },
        ]
      : paymentYear < 2007
        ? [
            //平成11年度から平成18年度の税構造
            { limit: 2000000, rate: 0.05, city: 0.03, pref: 0.02, adjustment: 0 },
            { limit: 7000000, rate: 0.1, city: 0.08, pref: 0.02, adjustment: 100000 },
            { limit: Infinity, rate: 0.13, city: 0.1, pref: 0.03, adjustment: 310000 },
          ]
        : [
            //平成19年度以降は一律10%課税
            { limit: Infinity, rate: 0.1, city: 0.06, pref: 0.04, adjustment: 0 },
          ];

  const fixedTaxTable =
    paymentYear < 1996
      ? {
          //平成8年度以降の標準税率を適用
          3: { cityTax: NaN, prefTax: NaN, ecoTax: NaN },
        }
      : paymentYear < 2004
        ? {
            //平成8年度以降平成16年度で人口段階別の税率区分が廃止されるまでの税制
            3: { cityTax: 3000, prefTax: 1000, ecoTax: 0 },
            2: { cityTax: 2500, prefTax: 1000, ecoTax: 0 },
            1: { cityTax: 2000, prefTax: 1000, ecoTax: 0 },
          }
        : paymentYear < 2014
          ? {
              //平成16年度で人口段階別の税率区分が廃止、25年度まで
              3: { cityTax: 3000, prefTax: 1000, ecoTax: 0 },
            }
          : paymentYear < 2024
            ? {
                //平成26年度で復興財源確保のため10年間加算(合計1000円)
                3: { cityTax: 3500, prefTax: 1500, ecoTax: 0 },
              }
            : {
                //令和6年度以降森林環境税(1000円)が創設
                3: { cityTax: 3000, prefTax: 1000, ecoTax: 1000 },
              };
  /*
  const taxReductionTable =
    taxYear < 1999
      ? [
          //定率減税の措置
          { incomeTaxReduceRate: 0, incomeTaxReduceLimit: 0, residentTaxReduceRate: 0, residentTaxReduceLimit: 0 },
        ]
      : taxYear < 2005
        ? [
            //平成11年以降平成16年まで定率減税の措置
            {
              incomeTaxReduceRate: 0.2,
              incomeTaxReduceLimit: 250000,
              residentTaxReduceRate: 0.15,
              residentTaxReduceLimit: 40000,
            },
          ]
        : taxYear === 2006
          ? [
              //平成18年個人所得税(課税対象平成17年)の定率減税が縮減
              {
                incomeTaxReduceRate: 0.2,
                incomeTaxReduceLimit: 250000,
                residentTaxReduceRate: 0.075,
                residentTaxReduceLimit: 20000,
              },
            ]
          : taxYear === 2007
            ? [
                //定率減税縮減移行期間
                {
                  incomeTaxReduceRate: 0.1,
                  incomeTaxReduceLimit: 125000,
                  residentTaxReduceRate: 0,
                  residentTaxReduceLimit: 0,
                },
              ]
            : [
                //平成19年分以降定率減税廃止
                {
                  incomeTaxReduceRate: 0,
                  incomeTaxReduceLimit: 0,
                  residentTaxReduceRate: 0,
                  residentTaxReduceLimit: 0,
                },
              ];

  //老年者控除
  //公的年金等控除
  //65歳以上の方に対する非課税措置
*/
  function getIncomeTaxRate(taxable: number): { incomeTaxRate: number; incomeTaxAdjustment: number } {
    for (const bracket of incomeTaxRateTable) {
      if (taxable <= bracket.limit) {
        return { incomeTaxRate: bracket.rate * reconstructionTax, incomeTaxAdjustment: bracket.adjustment };
      }
    }
    return { incomeTaxRate: NaN, incomeTaxAdjustment: NaN };
  }

  function getResidentTaxRate(taxable: number): {
    taxRateCity: number;
    taxRatePref: number;
    residentTaxAdjustment: number;
  } {
    for (const bracket of residentTaxRateTable) {
      if (taxable <= bracket.limit) {
        return { taxRateCity: bracket.city, taxRatePref: bracket.pref, residentTaxAdjustment: bracket.adjustment };
      }
    }
    return { taxRateCity: NaN, taxRatePref: NaN, residentTaxAdjustment: NaN };
  }

  function getFixedTax() {
    const citySize = 3; //人口50万以上の市:3, 人口5万以上50万未満の市:2, その他の市及び町村:1
    const fixedTax = fixedTaxTable[citySize];
    return { cityTax: fixedTax.cityTax, prefTax: fixedTax.prefTax, ecoTax: fixedTax.ecoTax };
  }

  //console.log('taxableIncome:', taxableIncome);
  const { incomeTaxRate, incomeTaxAdjustment } = getIncomeTaxRate(taxableIncome);
  const { taxRateCity, taxRatePref, residentTaxAdjustment } = getResidentTaxRate(taxableResident);
  const { cityTax, prefTax, ecoTax } = getFixedTax();
  const residentTaxRate = taxRateCity + taxRatePref;
  const cityRatio = taxRateCity / residentTaxRate;

  const taxSystem = {
    rate: {
      incomeTax: incomeTaxRate,
      residentTax: residentTaxRate,
      cityTax: taxRateCity,
      prefTax: taxRatePref,
      cityRatio: cityRatio,
    },
    adjustment: { incomeTax: { amount: incomeTaxAdjustment }, residentTax: { amount: residentTaxAdjustment } },
    fixed: { cityTax: { amount: cityTax }, prefTax: { amount: prefTax }, ecoTax: { amount: ecoTax } },
  };

  return taxSystem;
}
