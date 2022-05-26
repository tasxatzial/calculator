export default class CalculationView {
    constructor(calcEl, modelData) {
        this.operandEl = calcEl.querySelector('.calc-operand');
        this.expressionEl = calcEl.querySelector('.calc-curr-expression');
        this.missingParensEl = calcEl.querySelector('.calc-missing-parens')
        this.leftParenEl = calcEl.querySelector('.calc-btn-left-paren');
        this.cursor = this.createCursor();
        this.update(modelData);
    }

    createCursor() {
        const span = document.createElement('span');
        span.innerText = '_';
        span.className = "cursor";
        return span;
    }

    getOperand() {
        return this.operandEl.textContent;
    }

    getExpression() {
        return this.expressionEl.textContent;
    }

    update(data) {
        let s = data.operand.toString();
        if (this.getOperand() !== s) {
            this.operandEl.textContent = s;
            this.operandEl.appendChild(this.cursor);
        }
        s = data.expression.toString();
        if (this.getExpression() !== s) {
            this.expressionEl.textContent = s;
        }
        if (data.leftParenCount !== 0 ) {
            let parentheses = '';
            for (let i = 0; i < data.leftParenCount; i++) {
                parentheses += ')';
            }
            this.missingParensEl.textContent = parentheses;
            const content = "'" + data.leftParenCount.toString() + "'";
            this.leftParenEl.style.setProperty("--content", content);
        } else {
            this.leftParenEl.style.setProperty("--content", "''");
            this.missingParensEl.textContent = '';
        }
    }
}