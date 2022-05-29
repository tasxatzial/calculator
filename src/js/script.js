import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';

const calc = document.querySelector('.calc');
const cursor = calc.querySelector('.cursor');
const optionBtns = calc.querySelector('.calc-option-btns');
const darkModeBtn = optionBtns.querySelector('.calc-btn-dark-theme');
const lightModeBtn = optionBtns.querySelector('.calc-btn-light-theme');
const btns = calc.querySelector('.calc-btns');

const KEYNAMES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '=', ')', '(', 'Backspace', 'Delete'];

const calculationModel = new CalculationModel();
const calculationView = new CalculationView(calc, calculationModel.getState());

(function() {
    calculationModel.addChangeListener(() => {
        const data = calculationModel.getState();
        calculationView.update(data);
    })
    cursor.classList.add('js-blinking');
})();

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
    if (event.target.closest('button')) {
        handleInput(event.target.dataset.btn);
    }
});

document.addEventListener('click', (event) => {
    if (calc.contains(event.target)) {
        cursor.classList.add('js-blinking');
    } else {
        cursor.classList.remove('js-blinking');
    }
});

document.addEventListener('keydown', (event) => {
    if (cursor.classList.contains('js-blinking')) {
        const keyName = pressedKey(event);
        if (KEYNAMES.indexOf(keyName) !== -1) {
            const btn = calc.querySelector(`[data-btn='${keyName}']`);
            btn.focus();
            handleInput(keyName);
        }
    }
});

function pressedKey(event) {
    let pressedKey;
    if (event.key) {
        pressedKey = event.key;
    } else if (event.keyCode) {
        pressedKey = String.fromCharCode(event.keyCode);
    }
    return pressedKey;
}

function handleInput(id) {
    switch(id) {
        case 'Backspace':
            calculationModel.delete();
            break;
        case 'Delete':
            calculationModel.init();
            break;
        case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case '0':case '.':
            calculationModel.selectDigit(id);
            break;
        case '(':
            calculationModel.selectLeftParen();
            break;
        case ')':
            calculationModel.selectRightParen();
            break;
        case '+':case '/': case '*':case '-':
            calculationModel.selectOperation(id);
            break;
        case '=':
            calculationModel.selectEvaluate();
            break;
    }
    calculationView.update(calculationModel.getState());
}

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
