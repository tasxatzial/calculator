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
                    this.changeToDarkTheme();
                    break;
                case 'dark-theme':
                    this.changeToLightTheme();
            }
        });
        btns.addEventListener('click', (event) => {
            if (!event.target.closest('button')) {
                return;
            }

            switch(event.target.dataset.btn) {
                case 'delete':
                    this.eventEmmiter.dispatch("delete", null);
                    break;
            }
        });
    }

    initEmitter(callbacks) {
        this.eventEmmiter.on("delete", () => callbacks.delete())
    }

    updateDisplay(data) {
        this.operand.textContent = data.operand.toString();
        this.expression.textContent = data.expression.toString();
    }

    changeToLightTheme() {
        if (!this.calc.classList.contains('js-light-theme')) {
            this.calc.classList.add('js-light-theme');
            this.darkModeBtn.classList.remove('calc-btn-active-theme');
            this.lightModeBtn.classList.add('calc-btn-active-theme');
        } 
    }
    
    changeToDarkTheme() {
        if (this.calc.classList.contains('js-light-theme')) {
            this.calc.classList.remove('js-light-theme');
            this.lightModeBtn.classList.remove('calc-btn-active-theme');
            this.darkModeBtn.classList.add('calc-btn-active-theme');
        } 
    }
}