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

    getPriority(operation) {
        switch(operation) {
            case '+':case '−':
                return 1;
            case '×':case '÷':
                return 2;
        }
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

    selectOperation(operation) {
        this.numberStack.push(parseFloat(this.operand));
        this.expression += this.operand + operation;
        while (!this.operatorStack.isEmpty() &&
                this.getPriority(operation) <= this.getPriority(this.operatorStack.top())) {
            const result = this.calculateStep();
            this.numberStack.push(result);
            this.operand = result.toString();
        }
        this.operatorStack.push(operation);
        this.lastAdded = operation;
        this.clearState = 1;
    }

    calculateStep() {
        const op = this.operatorStack.pop();
        const n1 = this.numberStack.pop();
        const n2 = this.numberStack.pop();
        switch(op) {
            case '+':
                return n1 + n2;
            case '÷':
                return n2 / n1;
            case '×':
                return n1 * n2;
            case '−':
                return n2 - n1;
        }
    }
}