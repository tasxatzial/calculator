import CalculationView from './CalculationView.js';
import CalculatorModel from './CalculatorModel.js';

const calc = document.querySelector('.calc');
const optionBtns = calc.querySelector('.calc-option-btns');
const darkModeBtn = optionBtns.querySelector('.calc-btn-dark-theme');
const lightModeBtn = optionBtns.querySelector('.calc-btn-light-theme');
const btns = calc.querySelector('.calc-btns');

const calculationModel = new CalculatorModel();
const calculationData = calculationModel.getState();
const calculationView = new CalculationView(calc, calculationData);


optionBtns.addEventListener('click', (event) => {
    if (!event.target.closest('button')) {
        return;
    }
    switch(event.target.closest('button').dataset.btn) {
        case 'light-theme':
            changeToLightTheme();
            break;
        case 'dark-theme':
            changeToDarkTheme();
            break;
    }
});

btns.addEventListener('click', (event) => {
    if (!event.target.closest('button')) {
        return;
    }
    let newOperand;
    switch(event.target.dataset.btn) {
        case 'delete':
            newOperand = calculationModel.deleteFromTmpOperand();
            calculationView.setOperand(newOperand);
            break;
        case 'number':
            const digit = event.target.textContent;
            newOperand = calculationModel.appendToTmpOperand(digit);
            calculationView.setOperand(newOperand);
            break;
    }
});

function changeToLightTheme() {
    if (!calc.classList.contains('js-light-theme')) {
        calc.classList.add('js-light-theme');
        darkModeBtn.classList.remove('js-active-theme');
        lightModeBtn.classList.add('js-active-theme');
    }
}

function changeToDarkTheme() {
    if (calc.classList.contains('js-light-theme')) {
        calc.classList.remove('js-light-theme');
        lightModeBtn.classList.remove('js-active-theme');
        darkModeBtn.classList.add('js-active-theme');
    }
}
