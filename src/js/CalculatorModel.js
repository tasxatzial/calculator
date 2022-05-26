import Stack from './Stack.js';

export default class CalculatorModel {
    constructor() {
        this.init();
    }

    init() {
        this.result = null;
        this.expression = '';
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
    
    hasLastNumberDot() {
        if (!this.isDigit(this.getLastAdded())) {
            return false;
        }
        for (let i = this.expression.length - 1; i >= 0; i--) {
            if (!this.isDigit(this.expression.charAt(i))) {
                return false;
            }
            if (this.expression.charAt(i) === '.') {
                return true;
            }
        }
    }

    getPriority(operation) {
        switch(operation) {
            case '+':case '−':
                return 1;
            case '×':case '÷':
                return 2;
        }
    }

    getLastAdded() {
        return this.expression.charAt(this.expression.length - 1);
    }

    getState() {
        return {
            result: this.result,
            expression: this.expression,
            leftParenCount: this.leftParenCount
        };
    }

    delete() {
        if (this.expression === '') {
            return;
        }
        const la = this.getLastAdded();
        if (la === '(') {
            this.leftParenCount--;
        }
        if (la == ')') {
            this.leftParenCount++;
        }
        this.expression = this.expression.slice(0, -1);
    }

    selectDigit(digit) {
        const la = this.getLastAdded();
        if (la === ')' ||
           (la === '0' && digit !== '.') ||
           (digit === '.' && this.hasLastNumberDot('.'))) {
            return;
        }
        this.expression += digit;
    }

    selectLeftParen() {
        const la = this.getLastAdded();
        if (la === ')' || this.isDigit(la)) {
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
    }

    selectRightParen() {
        const la = this.getLastAdded();
        if (this.leftParenCount === 0 || this.isOperation(la) || la === '(') {
            return;
        }
        this.expression += ')';
        this.leftParenCount--;
    }

    selectOperation(operation) {
        const la = this.getLastAdded();
        if (this.isOperation(la) ||
           (la === '' && operation !== '−') ||
           (la === '(' && operation !== '−')) {
            return;
        }
        if (operation === '−' && (la === '' || la === '(')) {
            this.expression += '0';
        }
        this.expression += operation;
    }

    selectEvaluate() {
        const la = this.getLastAdded();
        if (this.isOperation(la) || this.leftParenCount !== 0) {
            return;
        }
        //eval
        this.result = 0;
    }
}