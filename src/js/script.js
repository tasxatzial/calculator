import CalculationView from './CalculationView.js';
import CalculatorModel from './CalculatorModel.js';

const calc = document.querySelector('.calc');
const optionBtns = calc.querySelector('.calc-option-btns');
const darkModeBtn = optionBtns.querySelector('.calc-btn-dark-theme');
const lightModeBtn = optionBtns.querySelector('.calc-btn-light-theme');
const btns = calc.querySelector('.calc-btns');

const calculationModel = new CalculatorModel();
const calculationView = new CalculationView(calc, calculationModel.getState());


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

window.addEventListener('keydown', (event) => {
    const keyName = pressedKey(event);
    handleInput(keyName);
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
        case 'Enter':
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
