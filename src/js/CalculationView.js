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

    render(data) {
        this._updateExpression(data.expressionTokens);
        this._updateParensCount(data.leftParenCount);
        this._updateResult(data.result);
        this._resetInvalidInputMsg();
        this._updateEmptyDisplayMsg();
    }

    setInvalidInputMsg() {
        this._updateInvalidInputMsg("Error: Not allowed input");
    }

    _updateResult(result) {
        if (result === null) {
            this.result.textContent = 'Error';
            this.equalsSign.removeAttribute('aria-hidden');
            return;
        }
        const formattedResult = CalculationViewHelper.formatNumberString(result);
        this.result.textContent = formattedResult;
        if (result === '') {
            this.equalsSign.setAttribute('aria-hidden', true);
        } else {
            this.equalsSign.removeAttribute('aria-hidden');
        }
    }

    _updateExpression(expressionTokens) {
        const formattedExpression = CalculationViewHelper.formatExpression(expressionTokens);
        this.expression.innerHTML = formattedExpression;
    }

    _updateParensCount(count) {
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

    _resetInvalidInputMsg() {
        this.invalidInputMsg.textContent = '';
    }

    _updateInvalidInputMsg(newMsg) {
        const msg = this.invalidInputMsg.textContent;
        if (msg.charAt(msg.length - 1) === '.') {
            this.invalidInputMsg.textContent = newMsg;
        } else {
            this.invalidInputMsg.textContent = newMsg + '.';
        }
    }

    _updateEmptyDisplayMsg() {
        if (this.expression.textContent === '') {
            this.emptyDisplayMsg.textContent = 'Display is empty';
        } else {
            this.emptyDisplayMsg.textContent = '';
        }
    }
}