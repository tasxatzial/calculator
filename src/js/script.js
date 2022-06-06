import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';
import CalculationHistoryModel from './CalculationHistoryModel.js';
import CalculationHistoryView from './CalculationHistoryView.js';
import ClickAndHold from './ClickAndHold.js';

const OPERATION_KEYNAMES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', ')', '(', 'Backspace', 'Delete'];

const calc = document.querySelector('.calc');
const calculationBtns = calc.querySelector('.calc-btns');
const output = calc.querySelector('.calc-output');

const optionBtns = calc.querySelector('.calc-options');
const darkModeBtn = optionBtns.querySelector('.calc-btn-dark-theme');
const lightModeBtn = optionBtns.querySelector('.calc-btn-light-theme');

const calculationHistory = calc.querySelector('.calc-history');
const calculationHistoryClearBtn = calculationHistory.querySelector('.calc-btn-history-clear');

const calculationModel = new CalculationModel();
const calculationView = new CalculationView({
    result: output.querySelector('.calc-result'),
    expression: output.querySelector('.calc-expression'),
    missingParens:  output.querySelector('.calc-expression-missing-parens'),
    leftParenBtn: calculationBtns.querySelector('.calc-btn-left-paren')
});
const calculationHistoryModel = new CalculationHistoryModel();
const calculationHistoryView = new CalculationHistoryView({
    calculationHistoryListContainer: calculationHistory.querySelector('.calc-history-list-container')
});

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
        case 'history':
            toggleHistory();
            break;
    }
});

calculationBtns.addEventListener('click', (event) => {
    if (event.target.closest('button')) {
        handleInput(event.target.dataset.btn);
    }
});

document.addEventListener('click', (event) => {
    if (calc.contains(event.target)) {
        calc.classList.add('js-calc-active');
    } else {
        calc.classList.remove('js-calc-active');
    }
});

document.addEventListener('keydown', (event) => {
    if (calc.classList.contains('js-calc-active')) {
        const keyName = pressedKey(event);
        if (OPERATION_KEYNAMES.indexOf(keyName) !== -1) {
            calculationBtns.querySelector(`[data-btn='${keyName}']`).focus();
            handleInput(keyName);
        }
    }
});

(function() {
    calculationView.render(calculationModel.toJSON());
    calculationModel.addChangeListener("changeState", () => {
        calculationView.render(calculationModel.toJSON());
    });
    calculationModel.addChangeListener("evaluate", () => {
        calculationHistoryModel.add(calculationModel.toJSON());
    });
    calculationHistoryModel.addChangeListener("changeState", () => {
        if (calc.classList.contains('js-history-open')) {
            calculationHistoryView.render(calculationHistoryModel.toJSON());
        }
    });
    ClickAndHold.apply(calculationHistoryClearBtn, {
        reset: resetClearHistoryBtnAnimation,
        run: runClearHistoryBtnAnimation,
        end: endClearHistoryBtnAnimation
    });
    calc.classList.add('js-calc-active');
})();

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
            calculationModel.reset();
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

function toggleHistory() {
    if (calc.classList.contains('js-history-open')) {
        calc.classList.remove('js-history-open');
    } else {
        calc.classList.add('js-history-open');
        calculationHistoryView.render(calculationHistoryModel.toJSON());
    }
}

function resetClearHistoryBtnAnimation(el) {
    el.style.setProperty('--bgcolorPos', '0%');
}

function runClearHistoryBtnAnimation(el, count) {
    el.style.setProperty('--bgcolorPos', count + '%');
}

function endClearHistoryBtnAnimation(el) {
    resetClearHistoryBtnAnimation(el);
    console.log('ended');
}