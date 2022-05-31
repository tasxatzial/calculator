import Stack from './Stack.js';
import Model from './Model.js';

export default class CalculatorModel extends Model {
    constructor() {
        super();
        Decimal.set({precision: 32});
        this.init();
        this.opToFunc = {
            '+': this.add,
            '-': this.subtract,
            '*': this.multiply,
            '/': this.divide,
            '^': this.pow,
            '~': this.uminus,
        }
    }

    init() {
        this.result = null;
        this.expression = '';
        this.leftParenCount = 0;
        this.raiseChange();
    }

    isDigit(c) {
        return !isNaN(parseFloat(c)) || c === '.';
    }

    isOperation(c) {
        return c === '/' ||
               c === '*' ||
               c === '+' ||
               c === '-' ||
               c === '~' ||
               c === '^';
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
        this.raiseChange();
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
        this.raiseChange();
    }

    selectLeftParen() {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isDigit(la)) {
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
        this.raiseChange();
    }

    selectRightParen() {
        const la = this.getLastAdded(1);
        if (this.leftParenCount === 0 || this.isOperation(la) || la === '(') {
            return;
        }
        this.expression += ')';
        this.leftParenCount--;
        this.raiseChange();
    }

    selectOperation(operation) {
        const la = this.getLastAdded(1);
        if (this.isOperation(la)) {
            return;
        }
        if (!this.isDigit(la) && operation === '-') {
            this.expression += '~';
        } else {
            this.expression += operation;
        }
        this.raiseChange();
    }

    selectEvaluate() {
        const la = this.getLastAdded(1);
        if (this.isOperation(la) || this.leftParenCount !== 0) {
            return;
        }
        const postfixExpr = this.exprToPostfix();
        this.result = this.evaluatePostfix(postfixExpr);
        //this.result = this.evaluateAsParsed();
        this.raiseChange();
    }

    exprToTokens() {
        return this.expression.split(/([/*+\-)(^~])/)
                              .filter(x => x);
    };

    exprToPostfix() {
        let postfixArr = [];
        let operatorStack = new Stack();
        let tokens = this.exprToTokens();
        for (let i = 0; i < tokens.length; i++) {
            if (!isNaN(tokens[i])) {
                postfixArr.push(tokens[i]);
            } else if (tokens[i] === '(') {
                operatorStack.push(tokens[i]);
            } else if (this.isOperation(tokens[i])) {
                while (!operatorStack.isEmpty() &&
                       operatorStack.top() !== '(' &&
                       (this.getPriority(tokens[i]) < this.getPriority(operatorStack.top()) ||
                         (this.getPriority(tokens[i]) === this.getPriority(operatorStack.top()) &&
                           this.getAssociativity(tokens[i]) === 'left'))) {
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
        let evalStack = new Stack();
        for (let i = 0; i < postfixArr.length; i++) {
            if (!isNaN(postfixArr[i])) {
                evalStack.push(postfixArr[i]);
            } else {
                const op = postfixArr[i];
                const n1 = new Decimal(evalStack.pop());
                if (this.getOperationArity(op) === 2) {
                    const n2 = new Decimal(evalStack.pop());
                    evalStack.push(this.opToFunc[op](n2, n1));
                } else if (this.getOperationArity(op) === 1) {
                    evalStack.push(this.opToFunc[op](n1));
                }
            }
        }
        return evalStack.top();
    }

    add(n1, n2) {
        return Decimal.add(n1, n2);
    }

    subtract(n1, n2) {
        return Decimal.sub(n1, n2);
    }

    multiply(n1, n2) {
        return Decimal.mul(n1, n2);
    }

    divide(n1, n2) {
        return Decimal.div(n1, n2);
    }

    //currently unused
    pow(n, p) {
        return Decimal.pow(n, p)
    }

    uminus(n) {
        return -n;
    }

    /*
    evaluateAsParsed() {
        let operatorStack = new Stack();
        let numberStack = new Stack();
        let tokens = this.exprToTokens();
        for (let i = 0; i < tokens.length; i++) {
            if (typeof(tokens[i]) === 'number') {
                numberStack.push(tokens[i]);
            } else if (tokens[i] === '(') {
                operatorStack.push(tokens[i]);
            } else if (this.isOperation(tokens[i])) {
                while (!operatorStack.isEmpty() && operatorStack.top() !== '(' &&
                       (this.getPriority(tokens[i]) < this.getPriority(operatorStack.top()) ||
                         (this.getPriority(tokens[i]) === this.getPriority(operatorStack.top()) &&
                           this.getAssociativity(tokens[i]) === 'left'))) {
                           numberStack.push(this.evaluateOnce(operatorStack, numberStack));
                }
                operatorStack.push(tokens[i]);
            } else if (tokens[i] === ')') {
                while(operatorStack.top() !== '(') {
                    numberStack.push(this.evaluateOnce(operatorStack, numberStack));
                }
                operatorStack.pop();
            }
        }
        while (!operatorStack.isEmpty()) {
            numberStack.push(this.evaluateOnce(operatorStack, numberStack));
        }

        return numberStack.top();
    }
    
    evaluateOnce(operatorStack, numberStack) {
        let n2 = numberStack.pop();
        let n1 = numberStack.pop();
        let op = operatorStack.pop();
        switch(op) {
            case '*':
                return n1 * n2;
            case '/':
                return n1 / n2;
            case '+':
                return n1 + n2;
            case '-':
                return n1 - n2;
            case '^':
                return n1 ** n2;
        }
    }
    */
}