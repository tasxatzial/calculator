import Stack from './Stack.js';
import Model from './Model.js';
import Decimal from '../node_modules/decimal.js/decimal.mjs';

export default class CalculationModel extends Model {
    constructor(props) {
        super();
        this.precision = 16;
        this.Dec = Decimal.clone({precision: this.precision});
        this.opToFn = {
            '+': (n1, n2) => new this.Dec(n1).add(n2),
            '-': (n1, n2) => new this.Dec(n1).minus(n2),
            '*': (n1, n2) => new this.Dec(n1).times(n2),
            '/': (n1, n2) => new this.Dec(n1).div(n2),
            '^': (n, p) => new this.Dec(n).pow(p),
            '~': (n) => new this.Dec(n).neg(),
        };
        if (props) {
            this.result = props.result;
            this.expression = props.expression;
            this.setPrevNumber();
            this.leftParenCount = props.leftParenCount;
        } else {
            this.initDefaults();
        }
    }

    initDefaults() {
        this.result = '';
        this.expression = '';
        this.prevNumber = '';
        this.leftParenCount = 0;
    }

    reset() {
        this.initDefaults();
        this.raiseChange("changeState");
    }

    load(props) {
        if (props) {
            this.result = props.result;
            this.expression = props.expression;
            this.setPrevNumber();
            this.leftParenCount = props.leftParenCount;
            this.raiseChange("changeState");
        }
    }

    setPrevNumber() {
        this.prevNumber = '';
        let i = this.expression.length - 1;
        while (i >= 0 && this.isDigitOrDot(this.expression.charAt(i))) {
            this.prevNumber = this.expression.charAt(i) + this.prevNumber;
            i--;
        }
    }

    isDigitOrDot(char) {
        return !isNaN(parseFloat(char)) || char === '.';
    }

    isOperation(char) {
        return char === '/' ||
               char === '*' ||
               char === '+' ||
               char === '-' ||
               char === '~' ||
               char === '^';
    }

    hasPrevNumberDot() {
        return this.prevNumber.split('.').length === 2;
    }

    isPrevNumberZero() {
        return this.prevNumber === '0';
    }

    hasPrevNumberMaxPrecision() {
        const decimalSplit = this.prevNumber.split('.');
        if (decimalSplit.length === 2) {
            return decimalSplit[0].length + decimalSplit[1].length === this.precision;
        } else {
            return decimalSplit[0].length === this.precision;
        }
    }

    getOperationArity(operation) {
        switch(operation) {
            case '+':case '-':case '*':case '/':case '^':
                return 2;
            case '~':
                return 1;
        }
    }

    getPriority(operation) {
        switch(operation) {
            case '+':case '-':
                return 1;
            case '*':case '/':
                return 2;
            case '^':
                return 3;
            case '~':
                return 4;
        }
    }

    getAssociativity(operation) {
        switch(operation) {
            case '+':case '-':case '*':case '/':case '~':
                return 'left';
            case '^':
                return 'right';
        }
    }

    getLastAdded(i) {
        return this.expression.charAt(this.expression.length - i);
    }

    getCalculation() {
        const result = (this.result === null) ? null : this.result.toString();
        return {
            result: result,
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
        this.setPrevNumber();
        this.result = '';
        this.raiseChange("changeState");
    }

    selectDigit(digit) {
        const la = this.getLastAdded(1);
        if (la === ')' || (digit !== '.' && this.isPrevNumberZero()) || (digit === '.' && this.hasPrevNumberDot('.')) || this.hasPrevNumberMaxPrecision()) {
                return;
        }
        if (!this.isDigitOrDot(la) && digit === '.') {
            this.expression += '0.';
            this.prevNumber = '0.' + this.prevNumber;
        } else {
            this.prevNumber += digit;
            this.expression += digit;
        }
        this.result = '';
        this.raiseChange("changeState");
    }

    selectLeftParen() {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isDigitOrDot(la)) {
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectRightParen() {
        const la = this.getLastAdded(1);
        if (this.leftParenCount === 0 || this.isOperation(la) || la === '(') {
            return;
        }
        this.expression += ')';
        this.leftParenCount--;
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectOperation(operation) {
        const la = this.getLastAdded(1);
        if (this.isOperation(la) ||
            ((la === '' || la === '(') && operation !== '-')) {
            return;
        }
        if (!this.isDigitOrDot(la) && la !== ')' && operation === '-') {
            this.expression += '~';
        } else {
            this.expression += operation;
        }
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectEvaluate() {
        const la = this.getLastAdded(1);
        if (this.expression === '') {
            return;
        }
        if (this.isOperation(la) || this.leftParenCount !== 0) {
            this.result = null;
        } else {
            try {
                const postfixExpr = this.exprToPostfix();
                this.result = this.evaluatePostfix(postfixExpr);
                this.raiseChange("evaluateSuccess");
            } catch (e) {
                this.result = null;
            }
        }
        this.raiseChange("changeState");
    }

    exprToPostfix() {
        const postfixArr = [];
        const operatorStack = new Stack();
        const tokens = this.expression.split(/([/*+\-)(^~])/).filter(x => x);
        for (let i = 0; i < tokens.length; i++) {
            if (!isNaN(tokens[i])) {
                postfixArr.push(tokens[i]);
            } else if (tokens[i] === '(') {
                operatorStack.push(tokens[i]);
            } else if (this.isOperation(tokens[i])) {
                while (!operatorStack.isEmpty() && operatorStack.top() !== '(' &&
                       (this.getPriority(tokens[i]) < this.getPriority(operatorStack.top()) ||
                         (this.getPriority(tokens[i]) === this.getPriority(operatorStack.top()) && this.getAssociativity(tokens[i]) === 'left'))) {
                            postfixArr.push(operatorStack.pop());
                }
                operatorStack.push(tokens[i]);
            } else if (tokens[i] === ')') {
                while(operatorStack.top() !== '(') {
                    postfixArr.push(operatorStack.pop());
                }
                operatorStack.pop();
            }
        }
        while (!operatorStack.isEmpty()) {
            postfixArr.push(operatorStack.pop());
        }
        return postfixArr;
    }


    evaluatePostfix(postfixArr) {
        const evalStack = new Stack();
        for (let i = 0; i < postfixArr.length; i++) {
            if (!isNaN(postfixArr[i])) {
                evalStack.push(postfixArr[i]);
            } else {
                const op = postfixArr[i];
                const n1 = evalStack.pop();
                if (this.getOperationArity(op) === 2) {
                    const n2 = evalStack.pop();
                    evalStack.push(this.opToFn[op](n2, n1));
                } else if (this.getOperationArity(op) === 1) {
                    evalStack.push(this.opToFn[op](n1));
                }
            }
        }
        return evalStack.top();
    }
}
