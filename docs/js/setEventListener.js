import { updateJapaneseYear, showTax } from './display';
import { getTaxYear, getProfile, getTaxable, getDeductions } from './input';
import { calcDeductions } from './deductions';
import { calcTax } from './tax';
import $ from 'jquery';
const taxYearIds = ['taxYear'];
function handleTaxYearChange(id) {
    console.log(`Tax Year changed: ${id}`);
    updateJapaneseYear();
}
const yearIds = ['taxYear', 'birthYear', 'birthYearS', 'moveInYear', 'renovYear'];
function handleYearChange(id) {
    console.log(`Year changed: ${id}`);
    // 必要に応じて他の処理を追加
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    // jQueryのイベントリスナーを設定
    $(document).on('keypress', '.just-num', function (e) {
        const charCode = e.which ? e.which : e.key;
        if (typeof charCode === 'number' && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
    });
    $(document).on('input', '.currency-input', function () {
        let val = this.value;
        val = val.replace(/,/g, '');
        if (val.length > 3) {
            const noCommas = Math.ceil(val.length / 3) - 1;
            const remain = val.length - noCommas * 3;
            const newVal = [];
            for (let i = 0; i < noCommas; i++) {
                newVal.unshift(val.substring(val.length - i * 3 - 3, val.length - i * 3));
            }
            newVal.unshift(val.substring(0, remain));
            this.value = newVal.join(',');
        }
        else {
            this.value = val;
        }
    });
    // すべての入力要素を取得
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');
    const radios = document.querySelectorAll('input[type="radio"]');
    //const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    //const buttons = document.querySelectorAll<HTMLButtonElement>('button');
    // 各入力要素にイベントリスナーを追加
    inputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            const target = event.target;
            console.log(`Input changed: ID=${target.id}, Value=${target.value}`);
            if (taxYearIds.includes(target.id)) {
                handleTaxYearChange(target.id);
            }
            if (yearIds.includes(target.id)) {
                handleYearChange(target.id);
            }
        });
    });
    // 各セレクト要素にイベントリスナーを追加
    selects.forEach((select) => {
        select.addEventListener('change', (event) => {
            const target = event.target;
            console.log(`Select changed: ID=${target.id}, Value=${target.value}`);
            if (yearIds.includes(target.id)) {
                handleYearChange(target.id);
            }
        });
    });
    // 各ラジオボタンにイベントリスナーを追加
    radios.forEach((radio) => {
        radio.addEventListener('change', (event) => {
            const target = event.target;
            console.log(`Radio changed: Name=${target.name}, Value=${target.value}`);
            if (yearIds.includes(target.id)) {
                handleYearChange(target.id);
            }
        });
    });
    // 各チェックボックスにイベントリスナーを追加
    // checkboxes.forEach((checkbox) => {
    //   checkbox.addEventListener('change', (event) => {
    //     const target = event.target as HTMLInputElement;
    //     console.log(`Checkbox changed: ID=${target.id}, Checked=${target.checked}`);
    //     if (yearIds.includes(target.id)) {
    //       handleYearChange(target.id);
    //     }
    //   });
    // });
    // 各ボタンにイベントリスナーを追加
    // buttons.forEach((button) => {
    //   button.addEventListener('click', (event) => {
    //     const target = event.target as HTMLButtonElement;
    //     console.log(`Button clicked: ID=${target.id}, Text=${target.textContent}`);
    //   });
    // });
    // ロード時の処理
    initialize();
});
function initialize() {
    console.log('initialize');
    updateJapaneseYear();
    getTaxYear();
    getProfile();
    getTaxable();
    getDeductions();
    calcDeductions();
    calcTax();
    showTax();
}
//# sourceMappingURL=setEventListener.js.map