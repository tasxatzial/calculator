import ViewUtils from './ViewUtils.js';

export default class CalculationView {
    constructor() {
        this.result = document.querySelector('.result-current');
        this.expression = document.querySelector('.expression-current');
        this.missingParens = document.querySelector('.missing-parens');
        this.leftParenBtn = document.querySelector('.btn-left-paren');
    }

    getResult() {
        if (this.result.children[1]) {
            return this.result.children[1].textContent;
        }
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
        if (result === null) {
            this.result.textContent = 'Error';
            return;
        }
        let formattedResult = ViewUtils.formatNumber(result);
        if (this.getResult() !== formattedResult) {
            this.result.innerText = formattedResult;
        }
    }

    updateExpression(expression) {
        let formattedExpression = ViewUtils.formatExpression(expression);
        if (this.getExpression() !== formattedExpression) {
            this.expression.innerHTML = formattedExpression;
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