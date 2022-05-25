export default class CalculationView {
    constructor(calcEl, modelData) {
        this.operandEl = calcEl.querySelector('.calc-operand');
        this.expressionEl = calcEl.querySelector('.calc-expression');
        this.leftParenEl = calcEl.querySelector('.calc-btn-left-paren');
        this.update(modelData);
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
        }
        s = data.expression.toString();
        if (this.getExpression() !== s) {
            this.expressionEl.textContent = s;
        }
        
        if (data.leftParenCount !== 0) {
            const content = "'" + data.leftParenCount.toString() + "'";
            this.leftParenEl.style.setProperty("--content", content);
        } else {
            this.leftParenEl.style.setProperty("--content", "''");
        }
    }
}