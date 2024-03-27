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

    setPrecision(postfixArr) {
        const numberLengths = postfixArr.filter(x => !isNaN(x))
                                        .map(x => x.length)
                                        .sort((a,b) => b - a);       
        if (numberLengths.length === 0) {
            this.Dec.set({precision: Math.max(1, this.precision)});
            return;
        }
        const maxLength = numberLengths[0];
        let maxLengthCount = 1;
        let i = 1;
        while (numberLengths[i++] === maxLength) {
            maxLengthCount++;
        }
        this.Dec.set({precision: Math.max(maxLength * numberLengths.length + 1, this.minPrecision)});
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

    getArity(operation) {
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
                return 'L';
            case '^':
                return 'R';
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

    selectDot() {
        const la = this.getLastAdded(1);
        if (this.hasPrevNumberDot() || !this.isDigitOrDot(la)) {
            this.raiseChange("invalidInput");
            return;
        }
        this.prevNumber += '.';
        this.expression += '.';
        this.result = '';
        this.raiseChange("changeState");
    }

    selectDigit(digit) {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isPrevNumberZero()) {
            this.raiseChange("invalidInput");
            return;
        }
        this.prevNumber += digit;
        this.expression += digit;
        this.result = '';
        this.raiseChange("changeState");
    }

    selectLeftParen() {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isDigitOrDot(la)) {
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
        const la = this.getLastAdded(1);
        if (this.leftParenCount === 0 || this.isOperation(la) || la === '(') {
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
        const la = this.getLastAdded(1);
        if (this.isOperation(la) ||
            ((la === '' || la === '(') && operation !== '-')) {
                this.raiseChange("invalidInput");
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
            this.raiseChange("invalidInput");
            return;
        }
        if (this.isOperation(la) || this.leftParenCount !== 0) {
            this.result = null;
        } else {
            try {
                const postfixArr = this.exprToPostfix();
                this.setPrecision(postfixArr);
                this.result = this.evaluatePostfix(postfixArr);
                this.raiseChange("evaluateSuccess");
            } catch (e) {
                this.result = null;
            }
        }
        this.raiseChange("changeState");
    }

    exprToPostfix() {
        const postfix = [];
        const stack = new Stack();
        const tokens = this.expression.split(/([/*+\-)(^~])/).filter(x => x);
        for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            if (!isNaN(tok)) {
                postfix.push(tok);
            } else if (tok === '(') {
                stack.push(tok);
            } else if (this.isOperation(tok)) {
                while(!stack.isEmpty()) {
                    const top = stack.top();
                    if (top === '(') {
                        break;
                    }
                    if (this.getPriority(tok) < this.getPriority(top) ||
                        (this.getPriority(tok) === this.getPriority(top) && this.getAssociativity(tok) === 'L')) {
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

    evaluatePostfix(postfixArr) {
        const evalStack = new Stack();
        for (let i = 0; i < postfixArr.length; i++) {
            if (!isNaN(postfixArr[i])) {
                evalStack.push(postfixArr[i]);
            } else {
                const op = postfixArr[i];
                const n1 = evalStack.pop();
                if (this.getArity(op) === 2) {
                    const n2 = evalStack.pop();
                    evalStack.push(this.opToFn[op](n2, n1));
                } else if (this.getArity(op) === 1) {
                    evalStack.push(this.opToFn[op](n1));
                }
            }
        }
        return evalStack.top();
    }
}
