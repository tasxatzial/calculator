import Stack from './Stack.js';

export default class CalculatorModel {
    constructor() {
        this.init();
    }

    init() {
        this.operand = '0';
        this.lastAdded = null;
        this.clearState = 0;
        this.expression = '';
        this.isOperandResult = false;
        this.leftParen = 0;
        this.operatorStack = new Stack();
        this.numberStack = new Stack();
    }

    isDigit(c) {
        return !isNaN(parseFloat(c)) || c === '.';
    }

    isOperation(c) {
        return c === '÷' ||
               c === '×' ||
               c === '+' ||
               c === '−';
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
        if (this.operand === '0' || this.isOperandResult) {
            return;
        }
        if (this.operand.length === 1) {
            this.operand = '0';
            this.lastAdded = null;
            this.clearState = 0;
        } else {
            this.operand = this.operand.slice(0, -1);
        }
    }

    clear() {
        if (this.clearState === 0) {
            this.init();
        } else {
            this.operand = '0';
            this.clearState = 0;
        }
    }

    selectDigit(digit) {
        if (this.isOperandResult) {
            this.expression = '';
            this.isOperandResult = false;
            this.operand = '0';
        }
        if (this.lastAdded === ')' ||
           (digit === '.' && this.operand.includes('.') && !this.isOperation(this.lastAdded))) {
            return;
        }
        if (this.isDigit(this.lastAdded)) {
            this.operand += digit;
        } else {
            this.operand = digit;
        }
        this.isOperandResult = false;
        this.lastAdded = digit;
        this.clearState = 1;
    }

    selectLeftParen() {
        if (this.isDigit(this.lastAdded) || this.lastAdded === ')') {
            return;
        }
        this.expression += '(';
        this.operand = '0';
        this.lastAdded = '(';
        this.leftParen++;
    }

    selectRightParen() {
        if (this.leftParen === 0 ||
            !(this.isDigit(this.lastAdded) || this.lastAdded === ')')) {
            return;
        }
        if (this.lastAdded === ')') {
            this.expression += ')';
        } else {
            this.expression += this.operand + ')';
        }
        this.lastAdded = ')';
        this.leftParen--;
    }

    selectOperation(operation) {
        if (this.isOperation(this.lastAdded)) {
            this.expression = this.expression.slice(0, -1) + operation;
        } else if (this.lastAdded === ')') {
            this.expression += operation;
        } else {
            this.expression += this.operand + operation;
        }
        this.clearState = 1;
        this.lastAdded = operation;
    }

    selectEvaluate() {
        if (this.isOperation(this.lastAdded) || this.leftParen !== 0) {
            return;
        }
        if (this.isDigit(this.lastAdded)) {
            this.expression += this.operand;
        }
        //eval
        this.expression += '=';
        this.isOperandResult = true;
    }
}