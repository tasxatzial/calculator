import Stack from './Stack.js';
import Model from './Model.js';

export default class CalculationModel extends Model {
    constructor(props) {
        super();
        this.precision = 16;
        this.Dec = Decimal.clone({precision: this.precision});
        this.opToFunc = {
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
        this.PrevNumber = '';
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
        this.PrevNumber = '';
        let i = this.expression.length - 1;
        while (i >= 0 && this.isDigit(this.expression.charAt(i))) {
            this.PrevNumber = this.expression.charAt(i) + this.PrevNumber;
            i--;
        }
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

    hasPrevNumberMaxPrecision() {
        let decimalSplit = this.PrevNumber.split('.');
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

    toJSON() {
        let resultJSON;
        if (this.result === null) {
            resultJSON = null;
        } else {
            resultJSON = this.result.toString();
        }
        return {
            result: resultJSON,
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
        if (la === ')' ||
            (digit !== '.' && this.isLastNumberZero()) ||
            (digit === '.' && this.hasLastNumberDot('.')) ||
            this.hasPrevNumberMaxPrecision()) {
                return;
        }
        if (!this.isDigit(la) && digit === '.') {
            this.expression += '0.';
            this.PrevNumber = '0.' + this.PrevNumber;
        } else {
            this.PrevNumber += digit;
            this.expression += digit;
        }
        this.result = '';
        this.raiseChange("changeState");
    }

    selectLeftParen() {
        const la = this.getLastAdded(1);
        if (la === ')' || this.isDigit(la)) {
            return;
        }
        this.expression += '(';
        this.leftParenCount++;
        this.result = '';
        this.PrevNumber = '';
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
        this.PrevNumber = '';
        this.raiseChange("changeState");
    }

    selectOperation(operation) {
        const la = this.getLastAdded(1);
        if (this.isOperation(la) ||
            ((la === '' || la === '(') && operation !== '-')) {
            return;
        }
        if (!this.isDigit(la) && operation === '-') {
            this.expression += '~';
        } else {
            this.expression += operation;
        }
        this.result = '';
        this.PrevNumber = '';
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

    exprToTokens() {
        return this.expression.split(/([/*+\-)(^~])/)
                              .filter(x => x);
    };

    exprToPostfix() {
        /* use a number stack instead of a postfixArr if we want evaluation while parsing */
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
                            /* if we want evaluation while parsing: instead of pushing to the postfixArr,
                            pop the operator stack and the appropriate operands from the number stack,
                            do the evaluation and push the result back to the number stack. Do the same
                            in lines marked with (1) */
                }
                operatorStack.push(tokens[i]);
            } else if (tokens[i] === ')') {
                while(operatorStack.top() !== '(') {
                    postfixArr.push(operatorStack.pop());
                    /* (1) */
                }
                operatorStack.pop();
            }
        }
        while (!operatorStack.isEmpty()) {
            postfixArr.push(operatorStack.pop());
            /* (1) */
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
                const n1 = evalStack.pop();
                if (this.getOperationArity(op) === 2) {
                    const n2 = evalStack.pop();
                    evalStack.push(this.opToFunc[op](n2, n1));
                } else if (this.getOperationArity(op) === 1) {
                    evalStack.push(this.opToFunc[op](n1));
                }
            }
        }
        return evalStack.top();
    }
}
