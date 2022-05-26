export default class CalculationView {
    constructor(calcEl, modelData) {
        this.resultEl = calcEl.querySelector('.calc-result');
        this.expressionEl = calcEl.querySelector('.calc-curr-expression');
        this.missingParensEl = calcEl.querySelector('.calc-missing-parens')
        this.leftParenEl = calcEl.querySelector('.calc-btn-left-paren');
        this.cursor = this.createCursor();
        this.init(modelData);
    }

    init(data) {
        this.resultEl.textContent = data.result.toString();
        this.expressionEl.textContent = data.expression.toString();
        this.expressionEl.appendChild(this.cursor);
    }

    createCursor() {
        const span = document.createElement('span');
        span.innerText = '_';
        span.className = "cursor";
        return span;
    }

    getResult() {
        return this.resultEl.textContent;
    }

    getExpression() {
        return this.expressionEl.textContent;
    }

    update(data) {
        let s = data.result.toString();
        if (this.getResult() !== s) {
            this.resultEl.textContent = s;
        }
        s = data.expression.toString();
        if (this.getExpression() !== s) {
            this.expressionEl.textContent = s;
            this.expressionEl.appendChild(this.cursor);
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