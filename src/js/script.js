import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';
import CalculationHistoryModel from './CalculationHistoryModel.js';
import CalculationHistoryView from './CalculationHistoryView.js';
import PressAndHold from './PressAndHold.js';
import KeyboardUtils from './KeyboardUtils.js';

const KEYNAMES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', ')', '(', 'Backspace', 'Delete'];

const calc = document.querySelector('.calc');
const operationBtns = calc.querySelector('.btns');
const output = calc.querySelector('.output-current');
const mainOptions = calc.querySelector('.main-options');
const toggleThemeBtn = calc.querySelector('.btn-toggle-theme');
const toggleHistoryBtn = mainOptions.querySelector('.btn-toggle-history');

const calculationHistory = calc.querySelector('.history');
const calculationHistoryClearBtn = calculationHistory.querySelector('.btn-history-clear');

let calculationModel;
let calculationHistoryModel;

const calculationView = new CalculationView({
    result: output.querySelector('.result-current'),
    expression: output.querySelector('.expression-current'),
    missingParens:  output.querySelector('.missing-parens'),
    leftParenBtn: operationBtns.querySelector('.btn-left-paren')
});
const calculationHistoryView = new CalculationHistoryView({
    calculationHistoryListContainer: calculationHistory.querySelector('.history-list-container')
});

/* initialize */
(function() {
    const theme = localStorage.getItem('calc-theme');
    if (theme === 'light') {
        toggleTheme();
    }

    const history = JSON.parse(localStorage.getItem('calc-history'));
    calculationHistoryModel = new CalculationHistoryModel(history);

    const currCalculation = JSON.parse(localStorage.getItem('calc-current-calculation'));
    calculationModel = new CalculationModel(currCalculation);

    calculationView.render(calculationModel.toJSON());

    calc.classList.add('js-calc-active');
})();

/* add listeners */
(function() {
    mainOptions.addEventListener('click', (event) => {
        if (!event.target.closest('button')) {
            return;
        }
        switch(event.target.closest('button').dataset.btn) {
            case 'theme':
                toggleTheme();
                break;
            case 'history':
                toggleHistory();
                break;
        }
    });

    /* operate calculator using clicks (mouse, space, enter) */
    operationBtns.addEventListener('click', (event) => {
        if (event.target.closest('button')) {
            const id = event.target.dataset.btn;
            if (document.activeElement === event.target &&
                id === '=') {
                    output.focus();
            }
            handleInput(event.target.dataset.btn);
        }
    });

    ['mousedown', 'touchstart', 'focusin']
    .forEach(type => {
        document.addEventListener(type, (event) => {
            if (calc.contains(event.target)) {
                calc.classList.add('js-calc-active');
            } else {
                calc.classList.remove('js-calc-active');
            }
        });
    });

    window.addEventListener('blur', () => {
        calc.classList.remove('js-calc-active');
    });

    /* operate calculator using keyboard shortcuts */
    document.addEventListener('keydown', (event) => {
        if (calc.classList.contains('js-calc-active')) {
            let keyName = KeyboardUtils.getKeyName(event);
            if (!calc.classList.contains('js-history-open') &&
                KEYNAMES.indexOf(keyName) !== -1) {
                  handleInput(keyName);
            } else if (KeyboardUtils.hasPressed_H(keyName)) {
                toggleHistory();
            }
        }
    });

    calculationHistoryView.bindLoadCalculation((id) => {
        const calculationJSON = calculationHistoryModel.get(id);
        calculationModel.load(calculationJSON);
    });

    calculationModel.addChangeListener("changeState", () => {
        calculationView.render(calculationModel.toJSON());
        localStorage.setItem('calc-current-calculation', JSON.stringify(calculationModel.toJSON()));
    });

    calculationModel.addChangeListener("evaluateSuccess", () => {
        calculationHistoryModel.add(calculationModel.toJSON());
    });

    calculationHistoryModel.addChangeListener("changeState", () => {
        localStorage.setItem('calc-history', JSON.stringify(calculationHistoryModel.toJSON()));
        if (calc.classList.contains('js-history-open')) {
            calculationHistoryView.render(calculationHistoryModel.toJSON());
        }
    });

    PressAndHold.apply(calculationHistoryClearBtn, {
        reset: resetClearHistoryBtnAnimation,
        run: runClearHistoryBtnAnimation,
        end: endClearHistoryBtnAnimation
    }, 500); //0.5s
})();

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

function toggleTheme() {
    if (!calc.classList.contains('js-light-theme')) {
        calc.classList.add('js-light-theme');
        toggleThemeBtn.innerHTML = `<i class="fa-solid fa-moon">`;
        localStorage.setItem('calc-theme', 'light');
    } else {
        calc.classList.remove('js-light-theme');
        toggleThemeBtn.innerHTML = `<i class="fa-solid fa-sun">`;
        localStorage.setItem('calc-theme', 'dark');
    }
}

function toggleHistory() {
    if (calc.classList.contains('js-history-open')) {
        calc.classList.remove('js-history-open');
        toggleHistoryBtn.setAttribute('aria-label', 'open history');
        toggleHistoryBtn.setAttribute('aria-expanded', 'false');
    } else {
        calc.classList.add('js-history-open');
        toggleHistoryBtn.setAttribute('aria-label', 'close history');
        toggleHistoryBtn.setAttribute('aria-expanded', 'true');
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
    calculationHistoryModel.clearHistory();
    localStorage.removeItem('calc-history');
}
