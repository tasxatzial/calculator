import Stack from './Stack.js';
import Model from './Model.js';
import Decimal from '../node_modules/decimal.js/decimal.mjs';

export default class CalculationModel extends Model {
    constructor(props) {
        super();
        this.Dec = Decimal.clone();
        this.minPrecision = 16;
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
            this.expression = props.expressionTokens.join("");
            this._setPrevNumber();
            this.leftParenCount = props.leftParenCount;
        } else {
            this._initDefaults();
        }
    }

    load(props) {
        if (props) {
            this.result = props.result;
            this.expression = props.expressionTokens.join("");
            this._setPrevNumber();
            this.leftParenCount = props.leftParenCount;
            this.raiseChange("changeState");
        }
    }

    reset() {
        this._initDefaults();
        this.raiseChange("changeState");
    }

    getCalculation() {
        const result = (this.result === null) ? null : this.result.toString();
        return {
            result: result,
            expressionTokens: this._getExprTokens(this.expression),
            leftParenCount: this.leftParenCount
        };
    }

    /* Sync a calculation to version 2. Modifies props. */
    static syncCalculation(props) {
        if (props.expression !== undefined) {
            props.expressionTokens = props.expression.split(/([/*+\-)(^~])/).filter(x => x);
            delete props.expression;
        }
    }

    delete() {
        if (this.expression === '') {
            return;
        }
        const la = this._getLastInput();
        if (la === '(') {
            this.leftParenCount--;
        }
        if (la == ')') {
            this.leftParenCount++;
        }
        this.expression = this.expression.slice(0, -1);
        this._setPrevNumber();
        this.result = '';
        this.raiseChange("changeState");
    }

    selectDot() {
        const la = this._getLastInput();
        if (this._isPrevNumberFractional() || !this._isDigitOrDot(la)) {
            this.raiseChange("invalidInput");
            return;
        }
        this.prevNumber += '.';
        this.expression += '.';
        this.result = '';
        this.raiseChange("changeState");
    }

    selectDigit(digit) {
        const la = this._getLastInput();
        if (la === ')' || this.prevNumber === '0') {
            this.raiseChange("invalidInput");
            return;
        }
        this.prevNumber += digit;
        this.expression += digit;
        this.result = '';
        this.raiseChange("changeState");
    }

    selectLeftParen() {
        const la = this._getLastInput();
        if (la === ')' || this._isDigitOrDot(la)) {
            this.raiseChange("invalidInput");
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectRightParen() {
        const la = this._getLastInput();
        if (this.leftParenCount === 0 || this._isOperation(la) || la === '(') {
            this.raiseChange("invalidInput");
            return;
        }
        this.expression += ')';
        this.leftParenCount--;
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectOperation(operation) {
        const la = this._getLastInput();
        if (this._isOperation(la) ||
            ((la === '' || la === '(') && operation !== '-')) {
                this.raiseChange("invalidInput");
                return;
        }
        if (!this._isDigitOrDot(la) && la !== ')' && operation === '-') {
            this.expression += '~';
        } else {
            this.expression += operation;
        }
        this.result = '';
        this.prevNumber = '';
        this.raiseChange("changeState");
    }

    selectEvaluate() {
        const la = this._getLastInput();
        if (this.expression === '') {
            this.raiseChange("invalidInput");
            return;
        }
        if (this._isOperation(la) || this.leftParenCount !== 0) {
            this.result = null;
        } else {
            try {
                const postfixArr = this._exprToPostfix();
                this._setPrecision(postfixArr);
                this.result = this._evaluatePostfix(postfixArr);
                this.raiseChange("evaluateSuccess");
            } catch (e) {
                this.result = null;
            }
        }
        this.raiseChange("changeState");
    }

    _initDefaults() {
        this.result = '';
        this.expression = '';
        this.prevNumber = '';
        this.leftParenCount = 0;
    }

    _setPrecision(postfixArr) {
        const numbers = postfixArr.filter(x => !isNaN(x))
        const totalLength = numbers.reduce((s, a) => s + a.length, 0);
        const avgLength = Math.ceil(totalLength / numbers.length);
        this.Dec.set({precision: Math.max(avgLength * (numbers.length + 1), this.minPrecision)});
    }

    _setPrevNumber() {
        this.prevNumber = '';
        let i = this.expression.length - 1;
        while (i >= 0 && this._isDigitOrDot(this.expression.charAt(i))) {
            this.prevNumber = this.expression.charAt(i) + this.prevNumber;
            i--;
        }
    }

    _isDigitOrDot(char) {
        return !isNaN(parseFloat(char)) || char === '.';
    }

    _isOperation(char) {
        return char === '/' ||
               char === '*' ||
               char === '+' ||
               char === '-' ||
               char === '~' ||
               char === '^';
    }

    _isPrevNumberFractional() {
        return this.prevNumber.split('.').length === 2;
    }

    _getArity(operation) {
        switch(operation) {
            case '+':case '-':case '*':case '/':case '^':
                return 2;
            case '~':
                return 1;
        }
    }

    _getPriority(operation) {
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

    _getAssociativity(operation) {
        switch(operation) {
            case '+':case '-':case '*':case '/':case '~':
                return 'L';
            case '^':
                return 'R';
        }
    }

    _getLastInput() {
        return this.expression.charAt(this.expression.length - 1);
    }

    _getExprTokens() {
        return this.expression.split(/([/*+\-)(^~])/).filter(x => x);
    }

    _exprToPostfix() {
        const postfix = [];
        const stack = new Stack();
        const tokens = this._getExprTokens();
        for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            if (!isNaN(tok)) {
                postfix.push(tok);
            } else if (tok === '(') {
                stack.push(tok);
            } else if (this._isOperation(tok)) {
                while(!stack.isEmpty()) {
                    const top = stack.top();
                    if (top === '(') {
                        break;
                    }
                    if (this._getPriority(tok) < this._getPriority(top) ||
                        (this._getPriority(tok) === this._getPriority(top) && this._getAssociativity(tok) === 'L')) {
                        postfix.push(top);
                        stack.pop();
                    } else {
                        break;
                    }
                }
                stack.push(tok);
            } else if (tok === ')') {
                while(stack.top() !== '(') {
                    postfix.push(stack.pop());
                }
                stack.pop();
            }
        }
        while (!stack.isEmpty()) {
            postfix.push(stack.pop());
        }
        return postfix;
    }

    _evaluatePostfix(postfixArr) {
        const evalStack = new Stack();
        for (let i = 0; i < postfixArr.length; i++) {
            if (!isNaN(postfixArr[i])) {
                evalStack.push(postfixArr[i]);
            } else {
                const op = postfixArr[i];
                const n1 = evalStack.pop();
                if (this._getArity(op) === 2) {
                    const n2 = evalStack.pop();
                    evalStack.push(this.opToFn[op](n2, n1));
                } else if (this._getArity(op) === 1) {
                    evalStack.push(this.opToFn[op](n1));
                }
            }
        }
        return evalStack.top();
    }
}
