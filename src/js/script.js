import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';
import CalculationHistoryModel from './CalculationHistoryModel.js';
import CalculationHistoryView from './CalculationHistoryView.js';
import KeyboardUtils from './KeyboardUtils.js';

const calc = document.querySelector('.calc');
const currentOutput = calc.querySelector('.output-current');
const mainOptions = calc.querySelector('.main-options');
const toggleThemeBtn = mainOptions.querySelector('.btn-toggle-theme');
const toggleHistoryBtn = mainOptions.querySelector('.btn-toggle-history');
const openHelpBtn = mainOptions.querySelector('.btn-open-help');
const closeHelpBtn = document.querySelector('.btn-close-help');
const historyClearBtn = document.querySelector('.btn-history-clear');

/* set the default theme */
if (localStorage.getItem('calc-theme') === 'light') {
    toggleTheme();
}

/* initialize models and views */
const calculationHistoryModel = new CalculationHistoryModel(JSON.parse(localStorage.getItem('calc-history')));
const calcHistoryView = new CalculationHistoryView();
const calculationModel = new CalculationModel(JSON.parse(localStorage.getItem('calc-current-calculation')));
const calculationView = new CalculationView();
calculationView.render(calculationModel.getCalculation());

/* ---------------------------------- listeners ---------------------------------- */
calculationModel.addChangeListener("changeState", () => {
    localStorage.setItem('calc-current-calculation', JSON.stringify(calculationModel.getCalculation()));
    calculationView.render(calculationModel.getCalculation());
});

calculationModel.addChangeListener("evaluateSuccess", () => {
    calculationHistoryModel.add(calculationModel.getCalculation());
});

calculationHistoryModel.addChangeListener("changeState", () => {
    localStorage.setItem('calc-history', JSON.stringify(calculationHistoryModel.getHistory()));
    if (calc.classList.contains('js-history-open')) {
        calcHistoryView.render(calculationHistoryModel.getHistory());
    }
});

calcHistoryView.bindLoadCalculation(id => {
    calculationModel.load(calculationHistoryModel.get(id));
});

calc.addEventListener('click', (event) => {
    const el = event.target.closest('button') || event.target.closest('a');
    if (!el) {
        return;
    }
    const targetData = el.tagName === 'BUTTON' ? el.dataset.btn : el.dataset.link;
    switch(targetData) {
        case 'switch-theme':
            toggleTheme();
            break;
        case 'clear-history':
            calculationHistoryModel.clearHistory();
            localStorage.removeItem('calc-history');
            break;
        case 'skip-to-clear-history':
            event.preventDefault();
            historyClearBtn.focus();
            break;
        case 'toggle-history':
            toggleHistory();
            break;
        case 'close-help':
            calc.classList.remove('js-help-open');
            openHelpBtn.focus();
            break;
        case 'open-help':
            calc.classList.add('js-help-open');
            closeHelpBtn.focus();
            break;
        default:
            if (targetData === '=') {
                currentOutput.focus();
            }
            handleInput(targetData);
    }
});

calc.addEventListener('keydown', (event) => {
    const keyName = KeyboardUtils.getKeyName(event);
    if (KeyboardUtils.is_H(keyName)) {
        toggleHistory();
        toggleHistoryBtn.focus();
    }
});

window.addEventListener('blur', () => {
    calc.classList.remove('js-calc-active');
});

['mousedown', 'touchstart', 'focusin'].forEach(type => {
    document.addEventListener(type, (event) => {
        if (calc.contains(event.target)) {
            calc.classList.add('js-calc-active');
        } else {
            calc.classList.remove('js-calc-active');
        }
    });
});

calc.classList.add('js-calc-active');

/* ------------------------ functions ------------------------ */
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
        case '=':case 'Enter':
            calculationModel.selectEvaluate();
            break;
    }
}

function getLightThemeSVG() {
    return `<svg class="icon" aria-hidden="true">
                <title>Switch to dark theme</title>
                <use xlink:href="img/sprite.svg#sun"></use>
            </svg>`;
}

function getDarkThemeSVG() {
    return `<svg class="icon" aria-hidden="true">
                <title>Switch to light theme</title>
                <use xlink:href="img/sprite.svg#moon"></use>
            </svg>`;
}

function toggleTheme() {
    if (calc.classList.contains('js-light-theme')) {
        toggleThemeBtn.innerHTML = getDarkThemeSVG();
        calc.classList.remove('js-light-theme');
        localStorage.setItem('calc-theme', 'dark');
    } else {
        toggleThemeBtn.innerHTML = getLightThemeSVG();
        calc.classList.add('js-light-theme');
        localStorage.setItem('calc-theme', 'light');
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
        calcHistoryView.render(calculationHistoryModel.getHistory());
    }
}
