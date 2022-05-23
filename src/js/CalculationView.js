export default class CalculationView {
    constructor(calcEl, modelData) {
        this.operandEl = calcEl.querySelector('.calc-operand');
        this.expressionEl = calcEl.querySelector('.calc-expression');
        this.setOperand(modelData.operand);
        this.setExpression(modelData.expression);
    }

    getOperand() {
        return this.operandEl.textContent;
    }

    getExpression() {
        return this.expressionEl.textContent;
    }

    setOperand(operand) {
        const s = operand.toString();
        if (this.getOperand() !== s) {
            this.operandEl.textContent = s;
        }
    }

    setExpression(expression) {
        const s = expression.toString();
        if (this.getExpression() !== s) {
            this.expressionEl.textContent = s;
        }
    }
}