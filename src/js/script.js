import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';
import CalculationHistoryModel from './CalculationHistoryModel.js';
import CalculationHistoryView from './CalculationHistoryView.js';

const calc = document.querySelector('.calc');
const currentOutput = calc.querySelector('.output-current');
const toggleThemeBtnText = calc.querySelector('#calculator-toggle-theme-btn-title');
const toggleThemeBtnIcon = calc.querySelector('#calculator-toggle-theme-btn-icon');
const toggleHistoryBtn = calc.querySelector('.btn-toggle-history');
const toggleHistoryBtnText = calc.querySelector('.toggle-history-btn-title');
const openHelpBtn = calc.querySelector('.btn-open-help');
const closeHelpBtn = calc.querySelector('.btn-close-help');
const historyClearBtn = calc.querySelector('.btn-history-clear');
const historyListContainer = calc.querySelector('.history-list-container');
const spritePath = new URL('../img/sprite.svg', import.meta.url).pathname;
const darkThemeMatchMedia = window.matchMedia('(prefers-color-scheme: dark)');
const themeKey = 'calc-key';
const darkThemeValue = 'dark';
const lightThemeValue = 'light';

/* theme has already been set in the html element, but we also need
to update toggle theme button */
if (document.documentElement.classList.contains('js-dark-theme')) {
    toggleThemeBtnIcon.setAttribute('xlink:href', `${spritePath}#moon`);
    toggleThemeBtnText.textContent = 'Switch to light theme';
}

/* initialize models and views */
const calculationHistoryModel = new CalculationHistoryModel(JSON.parse(localStorage.getItem('calc-history')));
const calculationHistoryView = new CalculationHistoryView(calc);
const calculationModel = new CalculationModel(JSON.parse(localStorage.getItem('calc-current-calculation')));
const calculationView = new CalculationView(calc);
calculationView.render(calculationModel.getCalculation());

/* ---------------------------------- listeners ---------------------------------- */

if (darkThemeMatchMedia.addEventListener && !localStorage.getItem(themeKey)) {
    darkThemeMatchMedia.addEventListener('change', darkThemeMatchMediaHandler);
}

calculationModel.addChangeListener("changeState", () => {
    localStorage.setItem('calc-current-calculation', JSON.stringify(calculationModel.getCalculation()));
    calculationView.render(calculationModel.getCalculation());
});

calculationModel.addChangeListener("evaluateSuccess", () => {
    calculationHistoryModel.add(calculationModel.getCalculation());
});

calculationModel.addChangeListener("invalidInput", () => {
    calculationView.setInvalidInputMsg();
});

calculationModel.addChangeListener("maxDigits", () => {
    calculationView.setMaxDigitsMsg();
});

calculationHistoryModel.addChangeListener("changeState", () => {
    localStorage.setItem('calc-history', JSON.stringify(calculationHistoryModel.getHistory()));
    if (calc.classList.contains('js-history-open')) {
        calculationHistoryView.render(calculationHistoryModel.getHistory());
    }
});

calculationHistoryModel.addChangeListener("historyClear", () => {
    localStorage.setItem('calc-history', JSON.stringify(calculationHistoryModel.getHistory()));
    calculationHistoryView.clear();
});

historyListContainer.addEventListener('click', (event) => {
    const el = event.target.closest('li');
    if (el) {
        calculationModel.load(calculationHistoryModel.get(el.dataset.id));
    }
});

calc.addEventListener('click', (event) => {
    const el = event.target.closest('button') || event.target.closest('a');
    if (!el) {
        return;
    }
    const targetData = el.tagName === 'BUTTON' ? el.dataset.btn : el.dataset.link;
    switch(targetData) {
        case 'switch-theme':
            darkThemeMatchMedia.removeEventListener('change', darkThemeMatchMediaHandler);
            if (document.documentElement.classList.contains('js-dark-theme')) {
                setLightTheme();
                localStorage.setItem(themeKey, lightThemeValue);
            } else {
                setDarkTheme();
                localStorage.setItem(themeKey, darkThemeValue);
            }
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

/* ------------------------ functions ------------------------ */
function handleInput(id) {
    switch(id) {
        case 'Backspace':
            calculationModel.delete();
            break;
        case 'Delete':
            calculationModel.reset();
            break;
        case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case '0':
            calculationModel.selectDigit(id);
            break;
        case '.':
            calculationModel.selectDot();
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

function setDarkTheme() {
    toggleThemeBtnIcon.setAttribute('xlink:href', `${spritePath}#moon`);
    toggleThemeBtnText.textContent = 'Switch to light theme';
    document.documentElement.classList.add('js-dark-theme');
}

function setLightTheme() {
    toggleThemeBtnIcon.setAttribute('xlink:href', `${spritePath}#sun`);
    toggleThemeBtnText.textContent = 'Switch to dark theme';
    document.documentElement.classList.remove('js-dark-theme');
}

function darkThemeMatchMediaHandler(event) {
    if (event.matches) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
}

function toggleHistory() {
    if (calc.classList.contains('js-history-open')) {
        calc.classList.remove('js-history-open');
        toggleHistoryBtn.setAttribute('aria-expanded', 'false');
        toggleHistoryBtnText.textContent = 'Open history';
    } else {
        calc.classList.add('js-history-open');
        toggleHistoryBtn.setAttribute('aria-expanded', 'true');
        toggleHistoryBtnText.textContent = 'Close history';
        calculationHistoryView.render(calculationHistoryModel.getHistory());
    }
}
