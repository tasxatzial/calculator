import Stack from './Stack.js';

export default class CalculatorModel {
    constructor() {
        this.operand = '0';
        this.expression = '0';
        this.clearState = 0;
        this.lastAdded = '';
        this.operatorStack = new Stack();
        this.numberStack = new Stack();
    }

    getState() {
        return {
            operand: this.operand,
            expression: this.expression
        };
    }
    
    delete() {
        let newOperand;
        if (this.operand.length === 1) {
            newOperand = '0';
        } else {
            newOperand = this.operand.slice(0, -1);
            this.resetClearState();
        }
        this.operand = newOperand;
    }

    resetClearState() {
        this.clearState = 0;
    }

    clear() {
        if (this.clearState === 0) {
            this.clearState = 1;
            this.operand = '0';
        } else if (this.clearState === 1) {
            this.resetClearState();
            this.expression = '0';
        }
    }

    selectDigit(digit) {
        let newOperand;
        if (this.operand === '0') {
            newOperand = digit;
        } else {
            newOperand = this.operand + digit;
            this.resetClearState();
        }
        this.operand = newOperand;
    }

    selectDot() {
        let newOperand;
        if (this.operand.includes('.')) {
            newOperand = this.operand;
        } else {
            newOperand = this.operand + '.';
            this.resetClearState();
        }
        this.operand = newOperand;
    }

    selectLeftParen() {
        if (typeof(this.lastAdded) === 'number' || this.lastAdded === ')') {
            return;
        }
        if (this.expression === '0') {
            this.expression = '(';
        } else {
            this.expression += '(';
        }
        this.operand = '0';
        this.operatorStack.push('(');
    }
}