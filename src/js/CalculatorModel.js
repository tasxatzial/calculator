import Stack from './Stack.js';

export default class CalculatorModel {
    constructor() {
        this.init();
    }

    init() {
        this.result = '';
        this.lastAdded = null;
        this.clearState = 0;
        this.expression = '';
        this.isOperandResult = false;
        this.leftParenCount = 0;
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
            result: this.result,
            expression: this.expression,
            leftParenCount: this.leftParenCount
        };
    }
    
    delete() {
        if (this.result === '' || this.isOperandResult) {
            return;
        }
        if (this.result.length === 1) {
            this.lastAdded = null;
            this.clearState = 0;
        }
        this.result = this.result.slice(0, -1);
    }

    clear() {
        if (this.clearState === 0) {
            this.init();
        } else {
            this.result = '';
            this.clearState = 0;
        }
    }

    selectDigit(digit) {
        if (this.isOperandResult) {
            this.expression = '';
            this.isOperandResult = false;
            this.result = '';
        }
        if (this.lastAdded === ')' ||
           (digit === '.' && this.result.includes('.') && !this.isOperation(this.lastAdded))) {
            return;
        }
        if (this.isDigit(this.lastAdded)) {
            this.result += digit;
        } else {
            this.result = digit;
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
        this.result = '';
        this.lastAdded = '(';
        this.leftParenCount++;
    }

    selectRightParen() {
        if (this.leftParenCount === 0 || this.isOperation(this.lastAdded)) {
            return;
        }
        if (this.lastAdded === ')') {
            this.expression += ')';
        } else {
            this.expression += this.result + ')';
        }
        this.lastAdded = ')';
        this.leftParenCount--;
    }

    selectOperation(operation) {
        if (this.isOperation(this.lastAdded)) {
            this.expression = this.expression.slice(0, -1) + operation;
        } else if (this.lastAdded === ')') {
            this.expression += operation;
        } else {
            this.expression += this.result + operation;
        }
        this.clearState = 1;
        this.lastAdded = operation;
    }

    selectEvaluate() {
        if (this.isOperation(this.lastAdded) || this.leftParenCount !== 0) {
            return;
        }
        if (this.isDigit(this.lastAdded)) {
            this.expression += this.result;
        }
        //eval
        this.expression += '=';
        this.isOperandResult = true;
    }
}