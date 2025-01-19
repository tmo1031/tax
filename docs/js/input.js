export function getTaxYear() {
    const taxYearInput = document.getElementById('taxYear');
    if (!taxYearInput) {
        console.error('TaxYear input not found');
        return;
    }
    return parseInt(taxYearInput.value, 10);
}
export function getProfile() {
    const profileInput = document.getElementById('profile');
    if (!profileInput) {
        console.error('Profile input not found');
        return;
    }
    return parseInt(profileInput.value, 10);
}
export function getTaxable() {
    const taxableInput = document.getElementById('taxable');
    if (!taxableInput) {
        console.error('Taxable input not found');
        return;
    }
    return parseInt(taxableInput.value, 10);
}
export function getDeductions() {
    const deductionsInput = document.getElementById('deductions');
    if (!deductionsInput) {
        console.error('Deductions input not found');
        return;
    }
    return parseInt(deductionsInput.value, 10);
}
//# sourceMappingURL=input.js.map