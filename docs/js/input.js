"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeductions = exports.getTaxable = exports.getProfile = exports.getTaxYear = void 0;
function getTaxYear() {
    const taxYearInput = document.getElementById('taxYear');
    if (!taxYearInput) {
        console.error('TaxYear input not found');
        return;
    }
    return parseInt(taxYearInput.value, 10);
}
exports.getTaxYear = getTaxYear;
function getProfile() {
    const profileInput = document.getElementById('profile');
    if (!profileInput) {
        console.error('Profile input not found');
        return;
    }
    return parseInt(profileInput.value, 10);
}
exports.getProfile = getProfile;
function getTaxable() {
    const taxableInput = document.getElementById('taxable');
    if (!taxableInput) {
        console.error('Taxable input not found');
        return;
    }
    return parseInt(taxableInput.value, 10);
}
exports.getTaxable = getTaxable;
function getDeductions() {
    const deductionsInput = document.getElementById('deductions');
    if (!deductionsInput) {
        console.error('Deductions input not found');
        return;
    }
    return parseInt(deductionsInput.value, 10);
}
exports.getDeductions = getDeductions;
//# sourceMappingURL=input.js.map