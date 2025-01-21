import { getTaxYear, getProfile, getDeductionInput, getTaxable } from './input.js';
import { calcDeductions } from './deductions.js';
import { calcTax } from './tax.js';
import { updateJapaneseYear, showTax } from './display.js';
import { specialEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');

  // 数字のみ入力を許可するイベントリスナーを設定
  document.querySelectorAll<HTMLInputElement>('.just-num').forEach((element) => {
    element.addEventListener('keypress', (e) => {
      const charCode = e.which ? e.which : e.keyCode;
      if (typeof charCode === 'number' && charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      }
    });
  });

  // カンマ区切りの入力を処理するイベントリスナーを設定
  document.querySelectorAll<HTMLInputElement>('.currency-input').forEach((element) => {
    element.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      let val = target.value;
      val = val.replace(/,/g, '');
      if (val.length > 3) {
        const noCommas = Math.ceil(val.length / 3) - 1;
        const remain = val.length - noCommas * 3;
        const newVal: string[] = [];
        for (let i = 0; i < noCommas; i++) {
          newVal.unshift(val.substring(val.length - i * 3 - 3, val.length - i * 3));
        }
        newVal.unshift(val.substring(0, remain));
        target.value = newVal.join(',');
      } else {
        target.value = val;
      }
    });
  });

  // すべての入力要素を取得
  const inputs = document.querySelectorAll<HTMLInputElement>('input');
  const selects = document.querySelectorAll<HTMLSelectElement>('select');
  const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  //const buttons = document.querySelectorAll<HTMLButtonElement>('button');

  // 各入力要素にイベントリスナーを追加
  inputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      console.log(`Input changed: ID=${target.id}, Value=${target.value}`);
      specialEvents(target.id);
    });
  });

  // 各セレクト要素にイベントリスナーを追加
  selects.forEach((select) => {
    select.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      console.log(`Select changed: ID=${target.id}, Value=${target.value}`);
      specialEvents(target.id);
    });
  });

  // 各ラジオボタンにイベントリスナーを追加
  radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      console.log(`Radio changed: Name=${target.name}, Value=${target.value}`);
      specialEvents(target.id);
    });
  });

  // 各チェックボックスにイベントリスナーを追加
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      console.log(`Checkbox changed: ID=${target.id}, Checked=${target.checked}`);
      specialEvents(target.id);
    });
  });

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
  getDeductionInput();
  getTaxable();
  calcDeductions();
  calcTax();
  showTax();
}
