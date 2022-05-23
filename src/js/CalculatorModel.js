export default class CalculatorModel {
    constructor() {
        this.operand = 0;
        this.operandTmp = '0';
        this.expression = '0';
        this.clearState = 0;
    }

    getState() {
        return {
            operand: this.operand,
            expression: this.expression
        };
    }

    appendToTmpOperand(digit) {
        let newOperand;
        if (this.operandTmp === '0') {
            newOperand = digit;
        } else {
            newOperand = this.operandTmp + digit;
            this.resetClearState();
        }
        this.operandTmp = newOperand;
        return newOperand;
    }

    deleteFromTmpOperand() {
        let newOperand;
        if (this.operandTmp.length === 1) {
            newOperand = '0';
        } else {
            newOperand = this.operandTmp.slice(0, -1);
            this.resetClearState();
        }
        this.operandTmp = newOperand;
        return newOperand;
    }

    resetClearState() {
        this.clearState = 0;
    }

    clear() {
        if (this.clearState === 0) {
            this.clearState = 1;
            this.operandTmp = '0';
            this.operand = 0;
        } else if (this.clearState === 1) {
            this.resetClearState();
            this.expression = '0';
        }
        return this.getState();
    }

    appendDot() {
        let newOperand;
        if (this.operandTmp.includes('.')) {
            newOperand = this.operandTmp;
        } else {
            newOperand = this.operandTmp + '.';
            this.resetClearState();
        }
        this.operandTmp = newOperand;
        return newOperand;
    }
}