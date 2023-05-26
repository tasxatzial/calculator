import ViewUtils from './ViewUtils.js';

export default class CalculationView {
    constructor(calcElement) {
        this.result = calcElement.querySelector('.result-current');
        this.expression = calcElement.querySelector('.expression-current');
        this.missingParens = calcElement.querySelector('.missing-parens');
        this.leftParenBtn = calcElement.querySelector('.btn-left-paren');
        this.equalsSign = calcElement.querySelector('.expression-current-equals-sign');
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
        this.updateExpression(data.expression);
        this.updateParensCount(data.leftParenCount);
        this.updateResult(data.result);
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
        if (result === '') {
            this.equalsSign.setAttribute('aria-hidden', true);
        } else {
            this.equalsSign.removeAttribute('aria-hidden');
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