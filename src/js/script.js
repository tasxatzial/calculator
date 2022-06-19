import CalculationView from './CalculationView.js';
import CalculationModel from './CalculationModel.js';
import CalculationHistoryModel from './CalculationHistoryModel.js';
import CalculationHistoryView from './CalculationHistoryView.js';
import PressAndHold from './PressAndHold.js';
import KeyboardUtils from './KeyboardUtils.js';

const calc = document.querySelector('.calc');
const operationBtns = calc.querySelector('.btns');
const output = calc.querySelector('.output-current');
const mainOptions = calc.querySelector('.main-options');
const help = calc.querySelector('.help');
const helpOptions = help.querySelector('.help-options');
const toggleThemeBtn = mainOptions.querySelector('.btn-toggle-theme');
const toggleHistoryBtn = mainOptions.querySelector('.btn-toggle-history');
const openHelpBtn = mainOptions.querySelector('.btn-open-help');
const closeHelpBtn = helpOptions.querySelector('.btn-close-help');
const calcHistory = calc.querySelector('.history');
const calcHistoryClearBtn = calcHistory.querySelector('.btn-history-clear');
const calcHistoryListContainer = calcHistory.querySelector('.history-list-container');

let calcModel;
let calcHistoryModel;
let calcView;
let calcHistoryView;
const KEYNAMES = [];

/* initialize */
(function() {
    operationBtns.querySelectorAll('button').forEach(btn => {
        KEYNAMES.push(btn.dataset.btn);
    });

    const theme = localStorage.getItem('calc-theme');
    if (theme === 'light') {
        toggleTheme();
    }

    const history = JSON.parse(localStorage.getItem('calc-history'));
    calcHistoryModel = new CalculationHistoryModel(history);

    const currCalculation = JSON.parse(localStorage.getItem('calc-current-calculation'));
    calcModel = new CalculationModel(currCalculation);

    calcView = new CalculationView({
        result: output.querySelector('.result-current'),
        expression: output.querySelector('.expression-current'),
        missingParens:  output.querySelector('.missing-parens'),
        leftParenBtn: operationBtns.querySelector('.btn-left-paren')
    });
    calcView.render(calcModel.toJSON());

    calcHistoryView = new CalculationHistoryView({
        calcHistoryListContainer: calcHistoryListContainer
    });

    calc.classList.add('js-calc-active');
})();

/* add listeners */
(function() {
    openHelpBtn.addEventListener('click', (e) => {
        calc.classList.add('js-help-open');
    });
    closeHelpBtn.addEventListener('click', (e) => {
        calc.classList.remove('js-help-open');
    });

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
            const keyname = event.target.dataset.btn;
            if (document.activeElement === event.target &&
                keyname === '=') {
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
            } else if (KeyboardUtils.is_H(keyName)) {
                toggleHistory();
            }
        }
    });

    calcHistoryView.bindLoadCalculation((id) => {
        const calculationJSON = calcHistoryModel.get(id);
        calcModel.load(calculationJSON);
    });

    calcHistory.addEventListener(getTransitionEndEventName(), (e) => {
        if (calc.classList.contains('js-history-open')) {
            calcHistory.focus();
        }
    });

    calcModel.addChangeListener("changeState", () => {
        calcView.render(calcModel.toJSON());
        localStorage.setItem('calc-current-calculation', JSON.stringify(calcModel.toJSON()));
    });

    calcModel.addChangeListener("evaluateSuccess", () => {
        calcHistoryModel.add(calcModel.toJSON());
    });

    calcHistoryModel.addChangeListener("changeState", () => {
        localStorage.setItem('calc-history', JSON.stringify(calcHistoryModel.toJSON()));
        if (calc.classList.contains('js-history-open')) {
            calcHistoryView.render(calcHistoryModel.toJSON());
        }
    });

    PressAndHold.apply(calcHistoryClearBtn, {
        reset: resetClearHistoryBtnAnimation,
        run: runClearHistoryBtnAnimation,
        end: endClearHistoryBtnAnimation
    }, 500); //0.5s
})();

function handleInput(id) {
    switch(id) {
        case 'Backspace':
            calcModel.delete();
            break;
        case 'Delete':
            calcModel.reset();
            break;
        case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case '0':case '.':
            calcModel.selectDigit(id);
            break;
        case '(':
            calcModel.selectLeftParen();
            break;
        case ')':
            calcModel.selectRightParen();
            break;
        case '+':case '/': case '*':case '-':
            calcModel.selectOperation(id);
            break;
        case '=':
            calcModel.selectEvaluate();
            break;
    }
}

function toggleTheme() {
    if (!calc.classList.contains('js-light-theme')) {
        calc.classList.add('js-light-theme');
        toggleThemeBtn.children[0].src = 'img/sun-dark.svg';
        toggleHistoryBtn.children[0].src = 'img/history-dark.svg';
        openHelpBtn.children[0].src = 'img/question-mark-dark.svg';
        closeHelpBtn.children[0].src = 'img/x-dark.svg';
        localStorage.setItem('calc-theme', 'light');
    } else {
        calc.classList.remove('js-light-theme');
        toggleThemeBtn.children[0].src = 'img/sun-light.svg';
        toggleHistoryBtn.children[0].src = 'img/history-light.svg';
        openHelpBtn.children[0].src = 'img/question-mark-light.svg';
        closeHelpBtn.children[0].src = 'img/x-light.svg';
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
        calcHistoryView.render(calcHistoryModel.toJSON());
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
    calcHistoryModel.clearHistory();
    localStorage.removeItem('calc-history');
}

function getTransitionEndEventName() {
    let transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    };
    for (let transition in transitions) {
        if (document.body.style[transition] !== undefined) {
            return transitions[transition];
        }
    }
}
