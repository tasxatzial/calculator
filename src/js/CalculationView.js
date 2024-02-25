import CalculationViewHelper from './CalculationViewHelper.js';

export default class CalculationView {
    constructor(calcElement) {
        this.result = calcElement.querySelector('.result-current');
        this.expression = calcElement.querySelector('.expression-current');
        this.missingParens = calcElement.querySelector('.missing-parens');
        this.leftParenBtn = calcElement.querySelector('.btn-left-paren');
        this.equalsSign = calcElement.querySelector('.expression-current-equals-sign');
        this.openParenthesesText = this.leftParenBtn.querySelector('.open-parentheses-text');
        this.invalidInputMsg = calcElement.querySelector('.invalid-input-msg');
        this.emptyDisplayMsg = calcElement.querySelector('.empty-display-msg');
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
        this.resetInvalidInputMsg();
        this.updateEmptyDisplayMsg();
    }

    updateResult(result) {
        if (result === null) {
            this.result.textContent = 'Error';
            this.equalsSign.removeAttribute('aria-hidden');
            return;
        }
        const formattedResult = CalculationViewHelper.formatNumber(result);
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
        const formattedExpression = CalculationViewHelper.formatExpression(expression);
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
            this.openParenthesesText.textContent = count + ' open parentheses';
        } else {
            this.leftParenBtn.style.setProperty("--content", "''");
            this.missingParens.textContent = '';
            this.openParenthesesText.textContent = '';
        }
    }

    setInvalidInputMsg() {
        this.updateInvalidInputMsg("Error: Not allowed input");
    }

    setMaxDigitsMsg() {
        this.updateInvalidInputMsg("Error: Number has maximum number of digits");
    }

    resetInvalidInputMsg() {
        this.invalidInputMsg.textContent = '';
    }

    updateInvalidInputMsg(newMsg) {
        const msg = this.invalidInputMsg.textContent;
        if (msg.charAt(msg.length - 1) === '.') {
            this.invalidInputMsg.textContent = newMsg;
        } else {
            this.invalidInputMsg.textContent = newMsg + '.';
        }
    }

    updateEmptyDisplayMsg() {
        if (this.getExpression() === '' && this.getResult() === '') {
            this.emptyDisplayMsg.textContent = 'Empty';
        } else {
            this.emptyDisplayMsg.textContent = '';
        }
    }
}