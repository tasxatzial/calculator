import View from './View.js';

export default class CalculationView extends View {
    constructor(calcEl) {
        super();
        this.resultEl = calcEl.querySelector('.calc-result');
        this.expressionEl = calcEl.querySelector('.calc-expression');
        this.missingParensEl = calcEl.querySelector('.calc-expression-missing-parens');
        this.leftParenBtn = calcEl.querySelector('.calc-btn-left-paren');
    }

    getResult() {
        return this.resultEl.textContent;
    }

    getExpression() {
        return this.expressionEl.textContent;
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
            this.expressionEl.textContent = formattedExpression;
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
}