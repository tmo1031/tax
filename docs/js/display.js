import { incomeDeductions, personalDeductions, taxCredits, tax } from './objects.js';
export function updateJapaneseYear() {
    const taxYearInput = document.getElementById('taxYear');
    const japaneseYearLabel = document.getElementById('japaneseYear');
    if (!taxYearInput || !japaneseYearLabel) {
        console.error('TaxYear input or JapaneseYear label not found');
        return;
    }
    // 西暦から元号への変換
    const taxYear = parseInt(taxYearInput.value, 10);
    const showaStartYear = 1925; // 昭和元年の開始年
    const heiseiStartYear = 1989; // 平成元年の開始年
    const reiwaStartYear = 2019; // 令和元年の開始年
    if (taxYear >= reiwaStartYear) {
        japaneseYearLabel.textContent = '令和' + `${taxYear - reiwaStartYear + 1}`;
    }
    else if (taxYear >= heiseiStartYear) {
        japaneseYearLabel.textContent = '平成' + `${taxYear - heiseiStartYear + 1}`;
    }
    else {
        japaneseYearLabel.textContent = '昭和' + `${taxYear - showaStartYear + 1}`;
    }
}
export function updateTaxable() {
    return;
}
export function updateDeductions() {
    return;
}
export function updateTax() {
    return;
}
export function showTax() {
    const getElement = (id) => document.getElementById(id);
    const taxElements = {
        incomeDeductions: {
            casualtyLoss: {
                S: { element: getElement('casualtyLossS'), value: incomeDeductions.casualtyLoss.incomeTax },
                J: { element: getElement('casualtyLossJ'), value: incomeDeductions.casualtyLoss.residentTax },
            },
            medical: {
                S: { element: getElement('medicalS'), value: incomeDeductions.medical.incomeTax },
                J: { element: getElement('medicalJ'), value: incomeDeductions.medical.residentTax },
            },
            social: {
                S: { element: getElement('socialS'), value: incomeDeductions.social.incomeTax },
                J: { element: getElement('socialJ'), value: incomeDeductions.social.residentTax },
            },
            pension: {
                S: { element: getElement('pensionS'), value: incomeDeductions.pension.incomeTax },
                J: { element: getElement('pensionJ'), value: incomeDeductions.pension.residentTax },
            },
            insuranceL: {
                S: { element: getElement('insuranceLS'), value: incomeDeductions.insuranceL.incomeTax },
                J: { element: getElement('insuranceLJ'), value: incomeDeductions.insuranceL.residentTax },
            },
            insuranceE: {
                S: { element: getElement('insuranceES'), value: incomeDeductions.insuranceE.incomeTax },
                J: { element: getElement('insuranceEJ'), value: incomeDeductions.insuranceE.residentTax },
            },
            donations: {
                S: { element: getElement('donationsS'), value: incomeDeductions.donations.incomeTax },
                //J: { element: getElement('donationsJ'), value: tax.donations },
            },
        },
        personalDeductions: {
            personal: {
                S: { element: getElement('personalS'), value: personalDeductions.personal.incomeTax },
                J: { element: getElement('personalJ'), value: personalDeductions.personal.residentTax },
            },
            spouse: {
                S: { element: getElement('spouseS'), value: personalDeductions.spouse.incomeTax },
                J: { element: getElement('spouseJ'), value: personalDeductions.spouse.residentTax },
            },
            dependent: {
                S: { element: getElement('dependentS'), value: personalDeductions.dependent.incomeTax },
                J: { element: getElement('dependentJ'), value: personalDeductions.dependent.residentTax },
            },
            basic: {
                S: { element: getElement('basicS'), value: personalDeductions.basic.incomeTax },
                J: { element: getElement('basicJ'), value: personalDeductions.basic.residentTax },
            },
        },
        taxCredits: {
            dividend: {
                S: { element: getElement('dividendS'), value: taxCredits.dividend.incomeTax },
                J: { element: getElement('dividendJ'), value: taxCredits.dividend.residentTax },
            },
            loans: {
                S: { element: getElement('loansS'), value: taxCredits.loans.incomeTax },
                J: { element: getElement('loansJ'), value: taxCredits.loans.residentTax },
            },
            donations: {
                S: { element: getElement('donationsCreditS'), value: taxCredits.donations.incomeTax },
                J: { element: getElement('donationsCreditJ'), value: taxCredits.donations.residentTax },
            },
            improvementHouse: {
                S: { element: getElement('improvementHouseS'), value: taxCredits.improvementHouse.incomeTax },
                //J: { element: getElement('improvementHouseJ'), value: },
            },
            disasterReduction: {
                S: { element: getElement('disasterReductionS'), value: taxCredits.disasterReduction.incomeTax },
                //J: { element: getElement('disasterReductionJ'), value: },
            },
            foreignTax: {
                S: { element: getElement('foreignTaxS'), value: taxCredits.foreignTax.incomeTax },
                J: { element: getElement('foreignTaxJ'), value: taxCredits.foreignTax.residentTax },
            },
            withholding: {
                Dividend: {
                    element: getElement('withholdingDividendCreditJ'),
                    value: taxCredits.withholdingDividend.residentTax,
                },
                Stock: { element: getElement('withholdingStockCreditJ'), value: taxCredits.withholdingStock.residentTax },
            },
        },
        tax: {
            income: {
                S: { element: getElement('incomeS'), value: tax.income.incomeTax },
                J: { element: getElement('incomeJ'), value: tax.income.residentTax },
            },
            deduction: {
                S: { element: getElement('deductionS'), value: tax.deduction.incomeTax },
                J: { element: getElement('deductionJ'), value: tax.deduction.residentTax },
            },
            taxable: {
                S: { element: getElement('taxableS'), value: tax.taxable.incomeTax },
                J: { element: getElement('taxableJ'), value: tax.taxable.residentTax },
            },
            taxPre: {
                S: { element: getElement('taxPreS'), value: tax.taxPre.incomeTax },
                J: { element: getElement('taxPreJ'), value: tax.taxPre.residentTax },
                City: { element: getElement('taxPreCity'), value: tax.taxPre.cityTax },
                Pref: { element: getElement('taxPrePref'), value: tax.taxPre.prefTax },
            },
            taxCredit: {
                S: { element: getElement('taxCreditS'), value: tax.taxCredit.incomeTax },
                J: { element: getElement('taxCreditJ'), value: tax.taxCredit.residentTax },
                City: { element: getElement('taxCreditCity'), value: tax.taxCredit.cityTax },
                Pref: { element: getElement('taxCreditPref'), value: tax.taxCredit.prefTax },
            },
            taxVar: {
                S: { element: getElement('taxVarS'), value: tax.taxVar.incomeTax },
                J: { element: getElement('taxVarJ'), value: tax.taxVar.residentTax },
                City: { element: getElement('taxVarCity'), value: tax.taxVar.cityTax },
                Pref: { element: getElement('taxVarPref'), value: tax.taxVar.prefTax },
            },
            taxFixed: {
                J: { element: getElement('taxFixedJ'), value: tax.taxFixed.residentTax },
                City: { element: getElement('taxFixedCity'), value: tax.taxFixed.cityTax },
                Pref: { element: getElement('taxFixedPref'), value: tax.taxFixed.prefTax },
                Eco: { element: getElement('taxFixedEco'), value: tax.taxFixed.ecoTax },
            },
            taxFinal: {
                S: { element: getElement('taxFinalS'), value: tax.taxFinal.incomeTax },
                J: { element: getElement('taxFinalJ'), value: tax.taxFinal.residentTax },
            },
            paid: {
                S: { element: getElement('paidS'), value: tax.paid.incomeTax },
                J: { element: getElement('paidJ'), value: tax.paid.residentTax },
            },
            refund: {
                S: { element: getElement('refundS'), value: tax.refund.incomeTax },
                J: { element: getElement('refundJ'), value: tax.refund.residentTax },
            },
        },
    };
    Object.values(taxElements).forEach((category) => {
        Object.values(category).forEach(({ element, value }) => {
            if (element) {
                element.textContent = `${value}`;
            }
        });
    });
    return;
}
//# sourceMappingURL=display.js.map