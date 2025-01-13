import { testCasesIncome, testCasesSpouse, testCasesLoan} from './testCases.js';
import { calcTaxable, getSpouseDeduction, getLoansCreditPre} from './calc.js';
import assert from 'assert';

// テストケースを実行する関数
function runTestCases() {
    console.log('Running test cases for income calculations:');
    testCasesIncome.forEach((testCase, index) => {
        const actual = calcTaxable(testCase.year, testCase.income);
        try {
            assert.deepEqual(actual, testCase.expected);
            console.log(`Test Case ${index + 1}: Passed`);
        } catch (error) {
            console.error(`Test Case ${index + 1}: Failed`, error);
            //process.exit(1); // エラーが発生した場合、プロセスを終了
        }
    });

    console.log('Running test cases for spouse deductions:');
    testCasesSpouse.forEach((testCase, index) => {
        const actual = getSpouseDeduction(testCase.year, testCase.hasSpouse, testCase.applicantTotal, testCase.spouseTotal, testCase.spouseAge);
        try {
            assert.deepEqual(actual, testCase.expected);
            console.log(`Test Case ${index + 1}: Passed`);
        } catch (error) {
            console.error(`Test Case ${index + 1}: Failed`, error);
            //process.exit(1); // エラーが発生した場合、プロセスを終了
        }
    });

    console.log('Running test cases for Loans deductions:');
    testCasesLoan.forEach((testCase, index) => {
        const actual = getLoansCreditPre(testCase.estate, testCase.Loans, testCase.taxable);
        try {
            assert.deepEqual(actual, testCase.expected);
            console.log(`Test Case ${index + 1}: Passed`);
        } catch (error) {
            console.error(`Test Case ${index + 1}: Failed`, error);
            //process.exit(1); // エラーが発生した場合、プロセスを終了
        }
    });
}

// テストケースを実行
runTestCases();