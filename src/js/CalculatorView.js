import EventEmitter from './EventEmitter.js'

export default class CalculatorView {
    constructor(calc) {
        this.eventEmmiter = new EventEmitter();
        this.calc = calc;
        this.operand = calc.querySelector('.calc-operand');
        this.expression = calc.querySelector('.calc-expression');
        this.darkModeBtn = document.querySelector('.calc-btn-dark-theme');
        this.lightModeBtn = document.querySelector('.calc-btn-light-theme');
    }

    initBtnListeners() {
        const optionBtns = this.calc.querySelector('.calc-option-btns');
        const btns = this.calc.querySelector('.calc-btns');

        optionBtns.addEventListener('click', (event) => {
            if (!event.target.closest('button')) {
                return;
            }
            switch(event.target.closest('button').dataset.btn) {
                case 'light-theme':
                    this.changeToLightTheme();
                    break;
                case 'dark-theme':
                    this.changeToDarkTheme();
            }
        });
        btns.addEventListener('click', (event) => {
            if (!event.target.closest('button')) {
                return;
            }
            switch(event.target.dataset.btn) {
                case 'delete':
                    this.eventEmmiter.dispatch("deleteFromOperand", {
                        'operand': this.getOperand()
                    });
                    break;
                case 'number':
                    this.eventEmmiter.dispatch("appendToOperand", {
                        'operand': this.getOperand(),
                        'digit': event.target.textContent
                    });
                    break;
            }
        });
    }

    initEmitter(callbacks) {
        this.eventEmmiter.on("appendToOperand", (data) => callbacks.appendToOperand(data))
        this.eventEmmiter.on("deleteFromOperand", (data) => callbacks.deleteFromOperand(data))
    }

    getOperand() {
        return this.operand.textContent;
    }

    updateOperand({operand}) {
        this.operand.textContent = operand;
    }

    updateExpression({expression}) {
        this.expression.textContent = expression;
    }

    changeToLightTheme() {
        if (!this.calc.classList.contains('js-light-theme')) {
            this.calc.classList.add('js-light-theme');
            this.darkModeBtn.classList.remove('js-active-theme');
            this.lightModeBtn.classList.add('js-active-theme');
        } 
    }
    
    changeToDarkTheme() {
        if (this.calc.classList.contains('js-light-theme')) {
            this.calc.classList.remove('js-light-theme');
            this.lightModeBtn.classList.remove('js-active-theme');
            this.darkModeBtn.classList.add('js-active-theme');
        } 
    }
}