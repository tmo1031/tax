export function getTaxable() {
  const taxableInput = document.getElementById('taxable') as HTMLInputElement | null;
  if (!taxableInput) {
    console.error('Taxable input not found');
    return;
  }
  return parseInt(taxableInput.value, 10);
}
