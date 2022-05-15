export default class CalculatorView {
    constructor(calc) {
        this.calc = calc;
        this.operand = calc.querySelector('calc-operand');
        this.expression = calc.querySelector('calc-expression');
        this.darkModeBtn = document.querySelector('.calc-btn-dark-theme');
        this.lightModeBtn = document.querySelector('.calc-btn-light-theme');
    }

    initChangeTheme() {
        this.darkModeBtn.addEventListener('click', () => this.changeToDarkTheme());
        this.lightModeBtn.addEventListener('click', () => this.changeToLightTheme());
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