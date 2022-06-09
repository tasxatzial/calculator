import View from './View.js';

export default class CalculationView extends View {
    constructor(elements) {
        super();
        this.result = elements.result;
        this.expression = elements.expression;
        this.missingParens = elements.missingParens;
        this.leftParenBtn = elements.leftParenBtn;
    }

    getResult() {
        return this.result.textContent;
    }

    getExpression() {
        return this.expression.textContent;
    }

    render(data) {
        this.updateResult(data.result);
        this.updateExpression(data.expression)
        this.updateParensCount(data.leftParenCount); 
    }

    updateResult(result) {
        let formattedResult = this.formatNumber(result);
        if (this.getResult() !== formattedResult) {
            this.result.textContent = formattedResult;
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
            this.missingParens.textContent = parentheses;
            const content = "'" + count.toString() + "'";
            this.leftParenBtn.style.setProperty("--content", content);
        } else {
            this.leftParenBtn.style.setProperty("--content", "''");
            this.missingParens.textContent = '';
        }
    }
}