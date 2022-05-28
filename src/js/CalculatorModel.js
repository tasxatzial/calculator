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
        for (let i = this.expression.length - 1; i >= 0; i--) {
            if (!this.isDigit(this.expression.charAt(i))) {
                return false;
            }
            if (this.expression.charAt(i) === '.') {
                return true;
            }
        }
        return false;
    }

    isLastNumberZero() {
        return this.getLastAdded(1) === '0' && !(this.isDigit(this.getLastAdded(2))); 
    }

    getPriority(operation) {
        switch(operation) {
            case '+':case '-':
                return 1;
            case '*':case '/':
                return 2;
        }
    }

    getLastAdded(i) {
        return this.expression.charAt(this.expression.length - i);
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
        const la = this.getLastAdded(1);
        if (la === '(') {
            this.leftParenCount--;
        }
        if (la == ')') {
            this.leftParenCount++;
        }
        this.expression = this.expression.slice(0, -1);
    }

    selectDigit(digit) {
        const la = this.getLastAdded(1);
        if (la === ')' ||
           (digit !== '.' && this.isLastNumberZero()) ||
           (digit === '.' && this.hasLastNumberDot('.'))) {
            return;
        }
        if (!this.isDigit(la) && digit === '.') {
            this.expression += '0.';
        } else {
            this.expression += digit;
        }
    }

    selectLeftParen() {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isDigit(la)) {
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
    }

    selectRightParen() {
        const la = this.getLastAdded(1);
        if (this.leftParenCount === 0 || this.isOperation(la) || la === '(') {
            return;
        }
        this.expression += ')';
        this.leftParenCount--;
    }

    selectOperation(operation) {
        const la = this.getLastAdded(1);
        if (this.isOperation(la) ||
           (operation !== '-' && (la === '' || la === '('))) {
            return;
        }
        if (operation === '-' && (la === '' || la === '(')) {
            this.expression += '0';
        }
        if (operation === '/') {
            this.expression += '÷';
        } else if (operation === '*') {
            this.expression += '×';
        } else if (operation === '-') {
            this.expression += '−';
        } else {
            this.expression += operation;
        }
    }

    selectEvaluate() {
        const la = this.getLastAdded(1);
        if (this.isOperation(la) || this.leftParenCount !== 0) {
            return;
        }
        //eval
        this.result = 0;
    }
}