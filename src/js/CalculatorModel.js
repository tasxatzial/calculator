import Stack from './Stack.js';

export default class CalculatorModel {
    constructor() {
        this.init();
    }

    init() {
        this.initOperand();
        this.initLastAdded();
        this.clearState = 0;
        this.expression = '';
        this.result = 0;
        this.operatorStack = new Stack();
        this.numberStack = new Stack();
    }

    initOperand() {
        this.operand = '0';
    }

    initLastAdded() {
        this.lastAdded = null;
    }

    wasLastAddedDigit() {
        return !isNaN(parseFloat(this.lastAdded));
    }

    getState() {
        return {
            operand: this.operand,
            expression: this.expression
        };
    }
    
    delete() {
        if (this.operand === '0') {
            return;
        }
        if (this.operand.length === 1) {
            this.initOperand();
            this.initLastAdded();
            this.clearState = 0;
        } else {
            this.operand = this.operand.slice(0, -1);
        }
    }

    clear() {
        if (this.clearState === 0) {
            this.init();
        } else {
            this.initOperand();
            this.clearState = 0;
        }
    }

    selectDigit(digit) {
        let newOperand;
        if (this.wasLastAddedDigit()) {
            newOperand = this.operand + digit;
        } else {
            newOperand = digit;
        }
        this.operand = newOperand;
        this.lastAdded = digit;
        this.clearState = 1;
    }

    selectDot() {
        let newOperand;
        if (this.operand.includes('.')) {
            newOperand = this.operand;
        } else {
            newOperand = this.operand + '.';
        }
        this.operand = newOperand;
        this.clearState = 1;
    }

    selectLeftParen() {
        if (this.wasLastAddedDigit() || this.lastAdded === ')') {
            return;
        }
        this.expression += '(';
        this.initOperand();
        this.lastAdded = '(';
        this.operatorStack.push('(');
    }
}