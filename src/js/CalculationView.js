export default class CalculationView {
    constructor(calcEl, modelData) {
        this.resultEl = calcEl.querySelector('.calc-result');
        this.expressionContainer = calcEl.querySelector('.calc-expression-container');
        this.expression = calcEl.querySelector('.calc-expression');
        this.missingParensEl = calcEl.querySelector('.calc-expression-parens')
        this.leftParenBtn = calcEl.querySelector('.calc-btn-left-paren');
        this.update(modelData);
    }

    getResult() {
        return this.resultEl.textContent;
    }

    getExpression() {
        return this.expression.textContent;
    }

    update(data) {
        this.updateResult(data.result);
        this.updateExpression(data.expression)
        this.updateParensCount(data.leftParenCount); 
    }

    updateResult(result) {
        if (result !== null) {
            let formattedResult = this.formatNumber(result);
            if (this.getResult() !== formattedResult) {
                this.resultEl.textContent = formattedResult;
            }
        } else {
            this.resultEl.textContent = '';
        }
    }

    updateExpression(expression) {
        let formattedExpression = this.formatExpression(expression);
        if (this.getExpression() !== formattedExpression) {
            this.expression.textContent = formattedExpression;
        }
    }

    updateParensCount(count) {
        if (count !== 0) {
            let parentheses = '';
            for (let i = 0; i < count; i++) {
                parentheses += ')';
            }
            this.missingParensEl.textContent = parentheses;
            const content = "'" + count.toString() + "'";
            this.leftParenBtn.style.setProperty("--content", content);
        } else {
            this.leftParenBtn.style.setProperty("--content", "''");
            this.missingParensEl.textContent = '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber.includes('e')) {
            return stringNumber;
        }
        const splitNumber = stringNumber.split('.');
        const integerPart = splitNumber[0];
        const decimalPart = splitNumber[1];
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
        let numbers = expression.split(/[/*+\-)(^~]/).filter(x => x !== '');
        let formattedNumbers = numbers.map(n => this.formatNumber(n));
        let expr = expression;
        for (let i = 0; i < numbers.length; i++) {
            expr = expr.replace(numbers[i], formattedNumbers[i]);
        }
        expr = expr.replace(/\//g, '÷').replace(/\*/g, '×').replace(/[-~]/g, '−');
        return expr;
    }
}