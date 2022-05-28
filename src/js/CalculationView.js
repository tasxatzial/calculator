export default class CalculationView {
    constructor(calcEl, modelData) {
        this.resultEl = calcEl.querySelector('.calc-result');
        this.expressionContainer = calcEl.querySelector('.calc-expression-container');
        this.expression = calcEl.querySelector('.calc-expression');
        this.missingParensEl = calcEl.querySelector('.calc-expression-parens')
        this.leftParenBtn = calcEl.querySelector('.calc-btn-left-paren');
        this.init(modelData);
    }

    init(data) {
        if (data.result) {
            this.resultEl.textContent = this.formatNumber(data.result);
        }
        this.expression.textContent = this.formatExpression(data.expression);
    }

    getResult() {
        return this.resultEl.textContent;
    }

    getExpression() {
        return this.expression.textContent;
    }

    update(data) {
        if (data.result != null) {
            let result = this.formatNumber(data.result);
            if (this.getResult() !== result) {
                this.resultEl.textContent = result;
            }
        } else {
            this.resultEl.textContent = '';
        }
        
        let expression = this.formatExpression(data.expression);
        if (this.getExpression() !== expression) {
            this.expression.textContent = expression;
        }
        if (data.leftParenCount !== 0) {
            let parentheses = '';
            for (let i = 0; i < data.leftParenCount; i++) {
                parentheses += ')';
            }
            this.missingParensEl.textContent = parentheses;
            const content = "'" + data.leftParenCount.toString() + "'";
            this.leftParenBtn.style.setProperty("--content", content);
        } else {
            this.leftParenBtn.style.setProperty("--content", "''");
            this.missingParensEl.textContent = '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString().split('.');
        const integerPart = stringNumber[0];
        const decimalPart = stringNumber[1];
        const formattedIntegerPart = parseFloat(integerPart).toLocaleString('en', {
            maximumFractionDigits: 0
        });
        if (decimalPart === undefined) {
            return formattedIntegerPart;
        } else {
            return formattedIntegerPart + '.' + decimalPart;
        }
    }

    formatExpression(expression) {
        let numbers = expression.split(/[/*+\-)(]/).filter(x => x !== '');
        let formattedNumbers = numbers.map(n => this.formatNumber(n));
        let expr = expression;
        for (let i = 0; i < numbers.length; i++) {
            expr = expr.replace(numbers[i], formattedNumbers[i]);
        }
        expr = expr.replace(/\//g, '÷').replace(/\*/g, '×').replace(/\-/g, '−');
        return expr;
    }
}