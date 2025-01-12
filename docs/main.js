import {
    calcTaxable,
    getSpouseDeduction,
    getDisabilityDeduction,
    getSingleDeduction,
    getStudentDeduction,
    getDependentDeduction,
    getBasicDeduction,
    getTaxRate,
    RoundBy,
    getCasualtyLoss,
    getMedialDeduction,
    getSocialDeduction,
    getMutualAidDeduction,
    getLifeInsuranceDeduction,
    getEInsuranceDeduction,
    getDonationDeduction,
    getDividendCredit,
    getLoansCredit,
    getDonationCredit,
    getImprovementCredit,
    getDisasterCredit,
    getForeignTaxCredit,
    getDividendRefund,
    getStockRefund,
} from './calc.js';

let taxYear = 2024; //2024年分の税額計算方法が基準

const createIncome = () => ({
    salary: null,
    pension: null,
    other: null,
    total: null,
});

const createAttributes = () => ({
    hasSpouse: null,
    minors: null,
    disability: null,
    single: null,
    student: null,
});

const createProfile = () => ({
    year: null,
    age: null,
    income: createIncome(),
    taxable: createIncome(),
    attributes: createAttributes(),
});

const createDependent = () => ({
    Specified: null,
    Elderly_LT: null,
    Elderly: null,
    Child: null,
    Other: null,
    Disability_LT: null,
    Disability_P: null,
    Disability_O: null,
});

const profile = {
    applicant: createProfile(),
    spouse: createProfile(),
    dependent: createDependent(),
};

const deductionInput = {
    Loss: { CasualtyLoss: 0, DisasterReduction: 0},
    Social: { Insurance: 0, MutualAid: 0},
    Insurance: { Life_New: 0, Life_Old: 0, Health:0, Annuity_New:0, Annuity_Old:0, Earthquake_Old:0, Earthquake_New:0 },
    Medical: { Expenses: 0 },
    Housing: { Loans: 0, Improvement: 0 },
    Donations: { HometownTax: 0, CommunityChest:0, Pref: 0, City: 0, Other: 0, Politics: 0, ApplyOneStop: 0, ApplyPolitics: 0 },
    Withholding: { Salary: 0, Stock_S: 0, Stock_J: 0, Dividend_S: 0, Dividend_J: 0, Non_Residents: 0},
    Other: { Dividend: 0, UnlistedStocks: 0, ForeignTax: 0},
    TaxReturn: { Apply: 0, Method_S: 0, Method_J: 0}
}

const personalDeductions = {
    Disability: { incomeTax: 0, residentTax: 0 },
    Single: { incomeTax: 0, residentTax: 0 },
    Student: { incomeTax: 0, residentTax: 0 },
    Spouse: { incomeTax: 0, residentTax: 0 },
    Dependent: { incomeTax: 0, residentTax: 0 },
    Basic: { incomeTax: 0, residentTax: 0 },
    Personal: { incomeTax: 0, residentTax: 0 },
};

const incomeDeductions = {
    CasualtyLoss: { incomeTax: 0, residentTax: 0 },
    Medical: { incomeTax: 0, residentTax: 0 },
    Social: { incomeTax: 0, residentTax: 0 },
    Pension: { incomeTax: 0, residentTax: 0 },
    InsuranceL: { incomeTax: 0, residentTax: 0 },
    InsuranceE: { incomeTax: 0, residentTax: 0 },
    Donations: { incomeTax: 0, residentTax: 0 },
};

const taxCredits = {
    Dividend: { incomeTax: 0, residentTax: 0 },
    Loans: { incomeTax: 0, residentTax: 0 },
    Donations: { incomeTax: 0, residentTax: 0 }, //政党等寄附金等は寄付金控除とマージ
    ImprovementHouse: { incomeTax: 0, residentTax: 0 },
    DisasterReduction: { incomeTax: 0, residentTax: 0 },
    ForeignTax: { incomeTax: 0, residentTax: 0 },
    Withholding_Dividend: { incomeTax: 0, residentTax: 0 },
    Withholding_Stock: { incomeTax: 0, residentTax: 0 },
};

const paid = {
    withholdings: {IncomeTax: 0, residentTax: 0 },
    Non_Residents: {IncomeTax: null, residentTax: 0 },
}

const tax = {
    income: { incomeTax: 0, residentTax: 0 },
    deduction: { incomeTax: 0, residentTax: 0 },
    taxable: { incomeTax: 0, residentTax: 0 },
    taxPre: { incomeTax: 0, residentTax: 0, cityTax: 0, prefTax: 0},
    taxCredit: { incomeTax: 0, residentTax: 0, cityTax: 0, prefTax: 0},
    taxVar: { incomeTax: 0, residentTax: 0, cityTax: 0, prefTax: 0},
    taxFixed: { incomeTax: 0, residentTax: 0, cityTax: 0, prefTax: 0, ecoTax: 0 },
    taxFinal: { incomeTax: 0, residentTax: 0 },
    paid: { incomeTax: 0, residentTax: 0 },
    refund: { incomeTax: 0, residentTax: 0 },
};

document.addEventListener("DOMContentLoaded", function () {
    // jQueryのイベントリスナーを設定
    $(document).on("keypress", ".just-number", function (e) {
        let charCode = (e.which) ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
    });

    $(document).on('input', '.currency-input', function (e) {
        let val = this.value;
        val = val.replace(/,/g, "");
        if (val.length > 3) {
            let noCommas = Math.ceil(val.length / 3) - 1;
            let remain = val.length - (noCommas * 3);
            let newVal = [];
            for (let i = 0; i < noCommas; i++) {
                newVal.unshift(val.substr(val.length - (i * 3) - 3, 3));
            }
            newVal.unshift(val.substr(0, remain));
            this.value = newVal;
        } else {
            this.value = val;
        }
    });

    // ネイティブのイベントリスナーを設定
    updateJapaneseYear();
    setupEventListeners();
});

function updateJapaneseYear() {
    const taxYearInput = document.getElementById("TaxYear");
    const japaneseYearLabel = document.getElementById("JapaneseYear");

    // 西暦から令和への変換
    const taxYear = parseInt(taxYearInput.value, 10);
    const heiseiStartYear = 1989; // 令和元年の開始年
    const reiwaStartYear = 2019; // 令和元年の開始年

    if (taxYear >= reiwaStartYear) {
        japaneseYearLabel.textContent = `令和${taxYear - reiwaStartYear + 1}`;
    } else if (taxYear >= heiseiStartYear) {
        japaneseYearLabel.textContent = `平成${taxYear - heiseiStartYear + 1}`;
    } else {
        japaneseYearLabel.textContent = "昭和";
    }
}

function setupEventListeners() {
    const TaxYearInput = document.getElementById('TaxYear');
    const birthYearInput = document.getElementById('birthYear');
    const incomeSalaryInput = document.getElementById('income_salary');
    const otherTaxableInput = document.getElementById('Taxable_other');
    const spouseCheckBox = document.getElementById('spouseCheck');
    const birthYearPInput = document.getElementById('birthYear_p');
    const incomeSalaryPInput = document.getElementById('income_salary_p');
    const otherTaxablePInput = document.getElementById('Taxable_other_p');
    const houseCheckBox = document.getElementById('houseCheck');
    const house_PriceInput = document.getElementById('house_Price');
    const house_ResidentInput = document.getElementById('house_Resident');
    const house_DebtInput = document.getElementById('house_Debt');
    const land_PriceInput = document.getElementById('land_Price');
    const land_ResidentInput = document.getElementById('land_Resident');
    const land_DebtInput = document.getElementById('land_Debt');

    const dependent_SpecifiedInput = document.getElementById('dependent_Specified');
    const dependent_Elderly_LTInput = document.getElementById('dependent_Elderly_LT');
    const dependent_ElderlyInput = document.getElementById('dependent_Elderly');
    const dependent_ChildInput = document.getElementById('dependent_Child');
    const dependent_OtherInput = document.getElementById('dependent_Other');
    const dependent_Disability_LTInput = document.getElementById('dependent_Disability_LT');
    const dependent_Disability_PInput = document.getElementById('dependent_Disability_P');
    const dependent_Disability_OInput = document.getElementById('dependent_Disability_O');
    const minorsCheckbox = document.getElementById('minors');
    const disability_PCheckbox = document.getElementById('disability_p');
    const disability_OCheckbox = document.getElementById('disability_o');
    const single_PCheckbox = document.getElementById('single_p');
    const single_OCheckbox = document.getElementById('single_o');
    const studentCheckbox = document.getElementById('student');

    const CasualtyLossInput = document.getElementById('CasualtyLoss');
    const DisasterReductionInput = document.getElementById('DisasterReduction');
    const SocialInsuranceInput = document.getElementById('SocialInsurance');
    const MutualAidInput = document.getElementById('MutualAid');
    const LifeInsuranceNewInput = document.getElementById('LifeInsurance_New');
    const LifeInsuranceOldInput = document.getElementById('LifeInsurance_Old');
    const HealthInsuranceInput = document.getElementById('HealthInsurance');
    const AnnuityNewInput = document.getElementById('Annuity_New');
    const AnnuityOldInput = document.getElementById('Annuity_Old');
    const EarthquakeInsuranceOldInput = document.getElementById('EarthquakeInsurance_Old');
    const EarthquakeInsuranceNewInput = document.getElementById('EarthquakeInsurance_New');
    const MedicalExpensesInput = document.getElementById('MedicalExpenses');
    const LoansInput = document.getElementById('Loans');
    const ImprovementHouseInput = document.getElementById('ImprovementHouse');
    const HometownTaxInput = document.getElementById('HometownTax');
    const CommunityChestInput = document.getElementById('CommunityChest');
    const DonationByPrefInput = document.getElementById('DonationByPref');
    const DonationByCityInput = document.getElementById('DonationByCity');
    const DonationOtherInput = document.getElementById('DonationOther');
    const ContributionsInput = document.getElementById('Contributions');
    const WithholdingSalaryInput = document.getElementById('Withholding_Salary');
    const WithholdingStockSInput = document.getElementById('Withholding_Stock_S');
    const WithholdingStockJInput = document.getElementById('Withholding_Stock_J');
    const WithholdingDividendSInput = document.getElementById('Withholding_Dividend_S');
    const WithholdingDividendJInput = document.getElementById('Withholding_Dividend_J');
    const NonResidentsInput = document.getElementById('Non_Residents');
    const DividendInput = document.getElementById('Dividend');
    const UnlistedStocksInput = document.getElementById('UnlistedStocks');
    const ForeignTaxInput = document.getElementById('ForeignTax');
    const ApplyOneStopCheck = document.getElementById('ApplyOneStop');
    const ApplyContributionsCheck = document.getElementById('ApplyContributions');
    //const DoTaxReturnSelect = document.getElementById('DoTaxReturn');
    const MethodSSelect = document.getElementById('Method_S');
    const MethodJSelect = document.getElementById('Method_J');
    
    const elementsToAddListeners = [
        { element: TaxYearInput, event: 'input', handler: () => refresh('byYear') },
        { element: TaxYearInput, event: 'input', handler: updateJapaneseYear },
        { element: birthYearInput, event: 'input', handler: () => refresh('byYear') },
        { element: incomeSalaryInput, event: 'input', handler: () => refresh('byIncome') },
        { element: otherTaxableInput, event: 'input', handler: () => refresh('byIncome') },
        { element: spouseCheckBox, event: 'input', handler: () => refresh('bySpouseCheck') },
        { element: birthYearPInput, event: 'input', handler: () => refresh('byYear') },
        { element: incomeSalaryPInput, event: 'input', handler: () => refresh('byIncome') },
        { element: otherTaxablePInput, event: 'input', handler: () => refresh('byIncome') },
        { element: dependent_SpecifiedInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_Elderly_LTInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_ElderlyInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_ChildInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_OtherInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_Disability_LTInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_Disability_PInput, event: 'change', handler: () => refresh('byDependent') },
        { element: dependent_Disability_OInput, event: 'change', handler: () => refresh('byDependent') },
        { element: minorsCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: disability_PCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: disability_OCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: single_PCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: single_OCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: studentCheckbox, event: 'change', handler: () => refresh('byDependent') },
        { element: CasualtyLossInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: DisasterReductionInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: SocialInsuranceInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: MutualAidInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: LifeInsuranceNewInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: LifeInsuranceOldInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: HealthInsuranceInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: AnnuityNewInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: AnnuityOldInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: EarthquakeInsuranceOldInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: EarthquakeInsuranceNewInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: MedicalExpensesInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: LoansInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: ImprovementHouseInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: HometownTaxInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: CommunityChestInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: DonationByPrefInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: DonationByCityInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: DonationOtherInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: ContributionsInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: WithholdingSalaryInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: WithholdingStockSInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: WithholdingStockJInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: WithholdingDividendSInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: WithholdingDividendJInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: NonResidentsInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: DividendInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: UnlistedStocksInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: ForeignTaxInput, event: 'input', handler: () => refresh('byDeductions') },
        { element: ApplyOneStopCheck, event: 'change', handler: () => refresh('byDeductions') },
        { element: ApplyContributionsCheck, event: 'change', handler: () => refresh('byDeductions') },
        //{ element: DoTaxReturnSelect, event: 'change', handler: () => refresh('byDeductions') },
        { element: MethodSSelect, event: 'change', handler: () => refresh('byDeductions') },
        { element: MethodJSelect, event: 'change', handler: () => refresh('byDeductions') },
    ];

    // ループを使用してイベントリスナーを追加
    elementsToAddListeners.forEach(({ element, event, handler }) => {
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.error('Element not found:', element);
        }
    });

    // すべてのDoTaxReturnラジオボタンを取得
    const doTaxReturnRadios = document.querySelectorAll('input[name="DoTaxReturn"]');
    // 各ラジオボタンにイベントリスナーを設定
    doTaxReturnRadios.forEach(radio => {
        radio.addEventListener('change', () => refresh('byDeductions'));
    });
    
    refresh('Init');
}

function refresh(mode) {
    console.log('refresh mode:', mode); // デバッグ用ログ

    // Profile が変更された時の更新処理 
    function updateProfile (mode) {
        console.log('updateProfile');
        if (mode === 'byYear') {
            // 年度によって未成年者へのチェックボックスを有効化を切り替える
        }
        if (mode === 'byIncome') {
            // 収入によって寡婦/勤労学生の有効化を切り替える
        }
        if (mode === 'bySpouseCheck') {
            const spouseCheck = document.getElementById('spouseCheck').checked;
            const className = spouseCheck ? 'visible' : 'hidden';
            const spouse = document.getElementById('spouse');
            spouse.classList.remove('visible', 'hidden');
            spouse.classList.add(className);
        }
        if (mode === 'byDependent') {
            // 扶養家族の有無によって寡婦の有効化を切り替える
        }
    }

    function updateAge (person, taxYear) {
        console.log('updateAge');
        //console.log('person, taxYear:', person, taxYear);
        const birthYear = parseInt(person.year);
        const age = taxYear - birthYear;
        person.age = age;
    }

    function getTaxYear () {
        console.log('getTaxYear');
        taxYear = parseInt(document.getElementById('TaxYear').value);
        //console.log('taxYear:', taxYear);
        updateAge(profile.applicant, taxYear);
        updateAge(profile.spouse, taxYear);
    }

    function getProfile () {
        console.log('getProfile');
        profile.applicant.year = parseInt(document.getElementById('birthYear').value);
        profile.applicant.income.salary = currencyToNum(document.getElementById('income_salary').value);
        profile.applicant.taxable.other = currencyToNum(document.getElementById('Taxable_other').value);
        profile.applicant.attributes.hasSpouse = document.getElementById('spouseCheck').checked;
        profile.spouse.year = profile.applicant.attributes.hasSpouse ? parseInt(document.getElementById('birthYear_p').value) : null;
        profile.spouse.income.salary = profile.applicant.attributes.hasSpouse ? currencyToNum(document.getElementById('income_salary_p').value) : null;
        profile.spouse.income.other = profile.applicant.attributes.hasSpouse ? currencyToNum(document.getElementById('Taxable_other_p').value) : null;

        profile.applicant.attributes.hasSpouse = document.getElementById('spouseCheck').checked ? 1 : 0;
        profile.applicant.attributes.minors = document.getElementById('minors').checked ? 1 : 0;
        profile.applicant.attributes.disability = document.getElementById('disability_p').checked ? 2: document.getElementById('disability_o').checked ? 1 : 0;
        profile.applicant.attributes.single = document.getElementById('single_p').checked ? 2: document.getElementById('single_o').checked ? 1 : 0;
        profile.applicant.attributes.student = document.getElementById('student').checked ? 1 : 0;
        profile.dependent.Specified = document.getElementById('dependent_Specified').value;
        profile.dependent.Elderly_LT = document.getElementById('dependent_Elderly_LT').value;
        profile.dependent.Elderly = document.getElementById('dependent_Elderly').value;
        profile.dependent.Child = document.getElementById('dependent_Child').value;
        profile.dependent.Other = document.getElementById('dependent_Other').value;
        profile.dependent.Disability_LT = document.getElementById('dependent_Disability_LT').value;
        profile.dependent.Disability_P = document.getElementById('dependent_Disability_P').value;
        profile.dependent.Disability_O = document.getElementById('dependent_Disability_O').value;

        updateAge(profile.applicant);
        updateAge(profile.spouse);

    }

    function setProfile () {
        console.log('setProfile');
    }

    function getDeductions () {
        console.log('getDeductions');
        deductionInput.Loss.CasualtyLoss = currencyToNum(document.getElementById('CasualtyLoss').value);
        deductionInput.Loss.DisasterReduction = currencyToNum(document.getElementById('DisasterReduction').value);
        deductionInput.Social.Insurance = Math.max(currencyToNum(document.getElementById('SocialInsurance').value) - currencyToNum(document.getElementById('MutualAid').value),0);
        deductionInput.Social.MutualAid = currencyToNum(document.getElementById('MutualAid').value);
        deductionInput.Insurance.Life_New = currencyToNum(document.getElementById('LifeInsurance_New').value);
        deductionInput.Insurance.Life_Old = currencyToNum(document.getElementById('LifeInsurance_Old').value);
        deductionInput.Insurance.Health = currencyToNum(document.getElementById('HealthInsurance').value);
        deductionInput.Insurance.Annuity_New = currencyToNum(document.getElementById('Annuity_New').value);
        deductionInput.Insurance.Annuity_Old = currencyToNum(document.getElementById('Annuity_Old').value);
        deductionInput.Insurance.Earthquake_Old = currencyToNum(document.getElementById('EarthquakeInsurance_Old').value);
        deductionInput.Insurance.Earthquake_New = currencyToNum(document.getElementById('EarthquakeInsurance_New').value);
        deductionInput.Medical.Expenses = currencyToNum(document.getElementById('MedicalExpenses').value);
        deductionInput.Housing.Loans = currencyToNum(document.getElementById('Loans').value);
        deductionInput.Housing.Improvement = currencyToNum(document.getElementById('ImprovementHouse').value);
        deductionInput.Donations.HometownTax = currencyToNum(document.getElementById('HometownTax').value);
        deductionInput.Donations.CommunityChest = currencyToNum(document.getElementById('CommunityChest').value);
        deductionInput.Donations.Pref = currencyToNum(document.getElementById('DonationByPref').value);
        deductionInput.Donations.City = currencyToNum(document.getElementById('DonationByCity').value);
        deductionInput.Donations.Other = currencyToNum(document.getElementById('DonationOther').value);
        deductionInput.Donations.Politics = currencyToNum(document.getElementById('Contributions').value);
        deductionInput.Donations.ApplyOneStop = document.getElementById('ApplyOneStop').checked ? 1 : 0;
        deductionInput.Donations.ApplyPolitics = document.getElementById('ApplyContributions').checked ? 1 : 0;
        deductionInput.Withholding.Salary = currencyToNum(document.getElementById('Withholding_Salary').value);
        deductionInput.Withholding.Stock_S = currencyToNum(document.getElementById('Withholding_Stock_S').value);
        deductionInput.Withholding.Stock_J = currencyToNum(document.getElementById('Withholding_Stock_J').value);
        deductionInput.Withholding.Dividend_S = currencyToNum(document.getElementById('Withholding_Dividend_S').value);
        deductionInput.Withholding.Dividend_J = currencyToNum(document.getElementById('Withholding_Dividend_J').value);
        deductionInput.Withholding.Non_Residents = currencyToNum(document.getElementById('Non_Residents').value);
        deductionInput.Other.Dividend = currencyToNum(document.getElementById('Dividend').value);
        deductionInput.Other.UnlistedStocks = currencyToNum(document.getElementById('UnlistedStocks').value);
        deductionInput.Other.ForeignTax = currencyToNum(document.getElementById('ForeignTax').value);
        const DoTaxReturn = $('input[name="DoTaxReturn"]:checked').val();
        deductionInput.TaxReturn.Apply = DoTaxReturn === "Yes" ? 1 : 0;
        const Method_S = document.getElementById('Method_S').value;
        deductionInput.TaxReturn.Method_S = Method_S === "Separate" ? 1 : Method_S === "Comprehensive" ? 2 : 0;
        const Method_J = document.getElementById('Method_J').value;
        deductionInput.TaxReturn.Method_S = Method_J === "Separate" ? 1 : Method_J === "Comprehensive" ? 2 : 0;
    }

    function calcDeductions () { 
        console.log('calcDeductions');
        function getPersonalDeductions() {
            //初期値にリセット
            personalDeductions.Disability = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Single = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Student = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Spouse = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Dependent = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Basic = { incomeTax: 0, residentTax: 0 };
            personalDeductions.Personal = { incomeTax: 0, residentTax: 0 };

            console.log('profile:', profile);
            personalDeductions.Disability = getDisabilityDeduction(taxYear, profile.applicant.attributes.disability);
            personalDeductions.Single = getSingleDeduction(taxYear, profile.applicant.attributes.single, profile.applicant.taxable);
            personalDeductions.Student = getStudentDeduction(taxYear, profile.applicant.attributes.student, profile.applicant.taxable);
            personalDeductions.Spouse = getSpouseDeduction(taxYear, profile.applicant.attributes.hasSpouse, profile.applicant.taxable.total, profile.spouse.taxable.total, profile.spouse.age);
            personalDeductions.Dependent = getDependentDeduction(taxYear, profile.dependent);
            personalDeductions.Basic = getBasicDeduction(taxYear, profile.applicant.taxable.total);

            // 人的控除の合計を計算
            function calculateTotalPersonal(deductions, types) {
                return types.reduce((total, type) => {
                    total.incomeTax += deductions[type].incomeTax;
                    total.residentTax += deductions[type].residentTax;
                    return total;
                }, { incomeTax: 0, residentTax: 0 });
            }
            const typesToSum = ['Disability', 'Single', 'Student'];
            const totalTax = calculateTotalPersonal(personalDeductions, typesToSum);
            personalDeductions.Personal.incomeTax = totalTax.incomeTax;
            personalDeductions.Personal.residentTax = totalTax.residentTax;

        }
        function getIncomeDeductions() {
            incomeDeductions.CasualtyLoss = getCasualtyLoss(taxYear, deductionInput.Loss.CasualtyLoss);
            incomeDeductions.Medical = getMedialDeduction(taxYear, deductionInput.Medical.Expenses, profile.applicant.taxable.total);
            incomeDeductions.Social = getSocialDeduction(taxYear, deductionInput.Social.Insurance);
            incomeDeductions.Pension = getMutualAidDeduction(taxYear, deductionInput.Social.MutualAid);
            incomeDeductions.InsuranceL = getLifeInsuranceDeduction(taxYear, deductionInput.Insurance);
            incomeDeductions.InsuranceE = getEInsuranceDeduction(taxYear, deductionInput.Insurance);
            incomeDeductions.Donations = getDonationDeduction(taxYear, deductionInput.Donations);
        }

        getPersonalDeductions();
        getIncomeDeductions();

    }

    function getTaxable () {
        console.log('getTaxable');
        profile.applicant.taxable.salary = calcTaxable(taxYear, profile.applicant.income.salary);
        profile.spouse.taxable.salary = calcTaxable(taxYear, profile.spouse.income.salary);

        function calcTotalTaxable(taxable) {
            console.log('calcTotalTaxable');
            taxable.total = taxable.salary + taxable.pension + taxable.other;
        }
        calcTotalTaxable(profile.applicant.taxable);
        calcTotalTaxable(profile.spouse.taxable);
    }

    function calcTax () {
        console.log('calcTax');

        function calcIncomeTax () {
            console.log('calcIncomeTax');
            tax.income.incomeTax = profile.applicant.taxable.total;
            tax.income.residentTax = profile.applicant.taxable.total;
        }
        function calcDeduction () {
            console.log('calcDeduction');
            tax.deduction.incomeTax = 
                personalDeductions.Personal.incomeTax +
                personalDeductions.Spouse.incomeTax +
                personalDeductions.Dependent.incomeTax +
                personalDeductions.Basic.incomeTax +
                incomeDeductions.CasualtyLoss.incomeTax +
                incomeDeductions.Medical.incomeTax +
                incomeDeductions.Social.incomeTax +
                incomeDeductions.Pension.incomeTax +
                incomeDeductions.InsuranceL.incomeTax +
                incomeDeductions.InsuranceE.incomeTax +
                incomeDeductions.Donations.incomeTax;
            tax.deduction.residentTax =
                personalDeductions.Personal.residentTax +
                personalDeductions.Spouse.residentTax +
                personalDeductions.Dependent.residentTax +
                personalDeductions.Basic.residentTax +
                incomeDeductions.CasualtyLoss.residentTax +
                incomeDeductions.Medical.residentTax +
                incomeDeductions.Social.residentTax +
                incomeDeductions.Pension.residentTax +
                incomeDeductions.InsuranceL.residentTax +
                incomeDeductions.InsuranceE.residentTax +
                incomeDeductions.Donations.residentTax;
        }
        function calcTaxable () {
            console.log('calcTaxable');
            tax.taxable.incomeTax = RoundBy(Math.max(tax.income.incomeTax - tax.deduction.incomeTax,0),1000);
            tax.taxable.residentTax = RoundBy(Math.max(tax.income.residentTax - tax.deduction.residentTax,0),1000);
        }
        function calcTaxPre () {
            console.log('calcTaxPre');
            tax.taxPre.incomeTax = RoundBy(tax.taxable.incomeTax * taxSystem.rate.incomeTax,1);
            tax.taxPre.cityTax = tax.taxable.residentTax * taxSystem.rate.cityTax;
            tax.taxPre.prefTax = tax.taxable.residentTax * taxSystem.rate.prefTax;
            tax.taxPre.residentTax = tax.taxPre.cityTax + tax.taxPre.prefTax;
        }

        function getTaxCredits() {
            taxCredits.Dividend = getDividendCredit(taxYear);// 配当控除の計算が難しいので保留
            taxCredits.Loans = getLoansCredit(taxYear, deductionInput.Housing.Loans, profile.applicant.taxable.total, tax.taxPre.incomeTax);
            taxCredits.Donations = getDonationCredit(taxYear, deductionInput.Donations);
            taxCredits.ImprovementHouse = getImprovementCredit(taxYear, deductionInput.Housing.Improvement);
            taxCredits.DisasterReduction = getDisasterCredit(taxYear, deductionInput.Loss.DisasterReduction);
            taxCredits.ForeignTax = getForeignTaxCredit(taxYear, deductionInput.Other.ForeignTax);
            taxCredits.Withholding_Dividend = getDividendRefund(taxYear, deductionInput.Withholding.Dividend_J);
            taxCredits.Withholding_Stock = getStockRefund(taxYear, deductionInput.Withholding.Stock_J);
        }

        function calcTaxCredit () {
            console.log('calcTaxCredit');
            tax.taxCredit.incomeTax = 
                taxCredits.Dividend.incomeTax +
                taxCredits.Loans.incomeTax +
                taxCredits.Donations.incomeTax +
                taxCredits.ImprovementHouse.incomeTax +
                taxCredits.DisasterReduction.incomeTax +
                taxCredits.ForeignTax.incomeTax;
            tax.taxCredit.residentTax =
                taxCredits.Dividend.residentTax +
                taxCredits.Loans.residentTax +
                taxCredits.Donations.residentTax +
                taxCredits.ForeignTax.residentTax +
                taxCredits.Withholding_Dividend.residentTax +
                taxCredits.Withholding_Stock.residentTax;
            
            tax.taxCredit.cityTax = tax.taxCredit.residentTax * taxSystem.rate.cityRatio;
            tax.taxCredit.prefTax = tax.taxCredit.residentTax * (1-taxSystem.rate.cityRatio);
        }
        function calcTaxVar () {
            console.log('calcTaxVar');
            tax.taxVar.incomeTax = tax.taxPre.incomeTax - tax.taxCredit.incomeTax;
            tax.taxVar.residentTax = tax.taxPre.residentTax - tax.taxCredit.residentTax;
            tax.taxVar.cityTax = tax.taxPre.cityTax - tax.taxCredit.cityTax;
            tax.taxVar.prefTax = tax.taxPre.prefTax - tax.taxCredit.prefTax;
        }
        function calcTaxFixed () {
            console.log('calcTaxFixed');
            tax.taxFixed.cityTax = taxSystem.fixed.cityTax;
            tax.taxFixed.prefTax = taxSystem.fixed.prefTax;
            tax.taxFixed.ecoTax = taxSystem.fixed.ecoTax;
            tax.taxFixed.residentTax = tax.taxFixed.cityTax + tax.taxFixed.prefTax + tax.taxFixed.ecoTax;
        }
        function calcTaxFinal () {
            console.log('calcTaxFinal');
            tax.taxFinal.incomeTax = tax.taxVar.incomeTax + tax.taxFixed.incomeTax;
            tax.taxFinal.residentTax = tax.taxVar.residentTax + tax.taxFixed.residentTax;
        }
        function calcPaid () {
            console.log('calcPaid');
            tax.paid.incomeTax = paid.withholdings.IncomeTax;
            tax.paid.residentTax = paid.withholdings.residentTax + paid.Non_Residents.residentTax;
        }
        function calcRefund () {
            console.log('calcRefund');
            tax.refund.incomeTax = tax.taxFinal.incomeTax - tax.paid.incomeTax;
            tax.refund.residentTax = tax.taxFinal.residentTax - tax.paid.residentTax;
        }

        calcIncomeTax();
        calcTaxable();
        calcDeduction();

        const taxSystem = getTaxRate(taxYear, tax.taxable.incomeTax, tax.taxable.residentTax);
        console.log('taxSystem:', taxSystem)
        calcTaxPre();
        getTaxCredits();
        calcTaxCredit();
        calcTaxVar();
        calcTaxFixed();
        calcTaxFinal();
        calcPaid();
        calcRefund();
    }

    function showTax () {
        console.log('showTax');
        const taxableSalary = document.getElementById('Taxable_salary');
        const taxableSalaryP = document.getElementById('Taxable_salary_p');
        taxableSalary.textContent = currencyFormat(profile.applicant.taxable.salary);
        taxableSalaryP.textContent = currencyFormat(profile.spouse.taxable.salary);

        CasualtyLoss_S.textContent = currencyFormat(incomeDeductions.CasualtyLoss.incomeTax);
        CasualtyLoss_J.textContent = currencyFormat(incomeDeductions.CasualtyLoss.residentTax);
        Medical_S.textContent = currencyFormat(incomeDeductions.Medical.incomeTax);
        Medical_J.textContent = currencyFormat(incomeDeductions.Medical.residentTax);
        Social_S.textContent = currencyFormat(incomeDeductions.Social.incomeTax);
        Social_J.textContent = currencyFormat(incomeDeductions.Social.residentTax);
        Pension_S.textContent = currencyFormat(incomeDeductions.Pension.incomeTax);
        Pension_J.textContent = currencyFormat(incomeDeductions.Pension.residentTax);
        InsuranceL_S.textContent = currencyFormat(incomeDeductions.InsuranceL.incomeTax);
        InsuranceL_J.textContent = currencyFormat(incomeDeductions.InsuranceL.residentTax);
        InsuranceE_S.textContent = currencyFormat(incomeDeductions.InsuranceE.incomeTax);
        InsuranceE_J.textContent = currencyFormat(incomeDeductions.InsuranceE.residentTax);
        Donations_S.textContent = currencyFormat(incomeDeductions.Donations.incomeTax);
        Personal_S.textContent = currencyFormat(personalDeductions.Personal.incomeTax);
        Personal_J.textContent = currencyFormat(personalDeductions.Personal.residentTax);
        Spouse_S.textContent = currencyFormat(personalDeductions.Spouse.incomeTax);
        Spouse_J.textContent = currencyFormat(personalDeductions.Spouse.residentTax);
        Dependent_S.textContent = currencyFormat(personalDeductions.Dependent.incomeTax);
        Dependent_J.textContent = currencyFormat(personalDeductions.Dependent.residentTax);
        Basic_S.textContent = currencyFormat(personalDeductions.Basic.incomeTax);
        Basic_J.textContent = currencyFormat(personalDeductions.Basic.residentTax);
        Dividend_S.textContent = currencyFormat(taxCredits.Dividend.incomeTax);
        Dividend_J.textContent = currencyFormat(taxCredits.Dividend.residentTax);
        Loans_S.textContent = currencyFormat(taxCredits.Loans.incomeTax);
        Loans_J.textContent = currencyFormat(taxCredits.Loans.residentTax);
        Contributions_S.textContent = currencyFormat(taxCredits.Donations.incomeTax);
        Donations_J.textContent = currencyFormat(taxCredits.Donations.residentTax);
        ImprovementHouse_S.textContent = currencyFormat(taxCredits.ImprovementHouse.incomeTax);
        DisasterReduction_S.textContent = currencyFormat(taxCredits.DisasterReduction.incomeTax);
        ForeignTax_S.textContent = currencyFormat(taxCredits.ForeignTax.incomeTax);
        ForeignTax_J.textContent = currencyFormat(taxCredits.ForeignTax.residentTax);
        Withholding_Dividend_J_2.textContent = currencyFormat(taxCredits.Withholding_Dividend.residentTax);
        Withholding_Stock_J_2.textContent = currencyFormat(taxCredits.Withholding_Stock.residentTax);

        IncomeTax_S.textContent = currencyFormat(tax.income.incomeTax);
        IncomeTax_J.textContent = currencyFormat(tax.income.residentTax);
        Deduction_S.textContent = currencyFormat(tax.deduction.incomeTax);
        Deduction_J.textContent = currencyFormat(tax.deduction.residentTax);
        Taxable_S.textContent = currencyFormat(tax.taxable.incomeTax);
        Taxable_J.textContent = currencyFormat(tax.taxable.residentTax);
        TaxPre_S.textContent = currencyFormat(tax.taxPre.incomeTax);
        TaxPre_J.textContent = currencyFormat(tax.taxPre.residentTax);
        TaxPre_City.textContent = currencyFormat(tax.taxPre.cityTax);
        TaxPre_Pref.textContent = currencyFormat(tax.taxPre.prefTax);
        TaxCredit_S.textContent = currencyFormat(tax.taxCredit.incomeTax);
        TaxCredit_J.textContent = currencyFormat(tax.taxCredit.residentTax);
        TaxCredit_City.textContent = currencyFormat(tax.taxCredit.cityTax);
        TaxCredit_Pref.textContent = currencyFormat(tax.taxCredit.prefTax);
        TaxVar_S.textContent = currencyFormat(tax.taxVar.incomeTax);
        TaxVar_J.textContent = currencyFormat(tax.taxVar.residentTax);
        TaxVar_City.textContent = currencyFormat(tax.taxVar.cityTax);
        TaxVar_Pref.textContent = currencyFormat(tax.taxVar.prefTax);
        //TaxFixed_S.textContent = currencyFormat(tax.taxFixed.incomeTax);
        TaxFixed_J.textContent = currencyFormat(tax.taxFixed.residentTax);
        TaxFixed_City.textContent = currencyFormat(tax.taxFixed.cityTax);
        TaxFixed_Pref.textContent = currencyFormat(tax.taxFixed.prefTax);
        TaxFixed_Eco.textContent = currencyFormat(tax.taxFixed.ecoTax);
        TaxFinal_S.textContent = currencyFormat(tax.taxFinal.incomeTax);
        TaxFinal_J.textContent = currencyFormat(tax.taxFinal.residentTax);
        Paid_S.textContent = currencyFormat(tax.paid.incomeTax);
        Paid_J.textContent = currencyFormat(tax.paid.residentTax);
        Refund_S.textContent = currencyFormat(tax.refund.incomeTax);
        Refund_J.textContent = currencyFormat(tax.refund.residentTax);
    }

    const actions = {
        Init: [
            getTaxYear,
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
        byYear: [
            getTaxYear,
            () => updateProfile('byYear'),            
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
        byIncome: [
            getTaxYear,
            () => updateProfile('byIncome'),
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
        bySpouseCheck: [
            getTaxYear,
            () => updateProfile('bySpouseCheck'),
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
        byDependent: [
            getTaxYear,
            () => updateProfile('byDependent'),
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
        byDeductions: [
            getTaxYear,
            getProfile,
            setProfile,
            getTaxable,
            getDeductions,
            calcDeductions,
            calcTax,
            showTax,
        ],
      };
    const functionsToRun = actions[mode] || [];
    functionsToRun.forEach(func => func());
}

function currencyFormat(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function currencyToNum(str) {
    return parseInt(str.replace(/,/g, ''));
}