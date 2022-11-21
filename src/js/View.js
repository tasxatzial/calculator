export default class View {
    constructor() {}

    formatNumber(str) {
        if (!this.isNumeric(str) || str.includes('e')) {
            return str;
        }
        const splitNumber = str.split('.');
        const formattedIntegerPart = splitNumber[0].split('').reverse()
        .reduce((res, val, index) => {
            if ((index + 1) % 3 === 0 && index !== splitNumber[0].length - 1) {
                return ',' + val + res;
            } else {
                return val + res;
            }
        });
        const decimalPart = splitNumber[1];
        if (decimalPart === undefined) {
            return formattedIntegerPart;
        } else {
            return formattedIntegerPart + '.' + decimalPart;
        }
    }

    formatExpression(expression) {
        let numbers = expression.split(/[/*+\-)(^~]/).filter(x => x !== '');
        let formattedNumbers = numbers.map(n => this.formatNumber(n));
        let expr = expression;
        for (let i = 0; i < numbers.length; i++) {
            expr = expr.replace(numbers[i], formattedNumbers[i]);
        }
        let finalExpr = '';
        for (let i = 0; i < expr.length; i++) {
            switch(expr.charAt(i)) {
                case '/':
                    finalExpr += '<span class="sr-only">divided by</span><span aria-hidden="true">÷</span>';
                    break;
                case '*':
                    finalExpr += '<span class="sr-only">times</span><span aria-hidden="true">×</span>';
                    break;
                case '+':
                    finalExpr += '<span class="sr-only">plus</span><span aria-hidden="true">+</span>';
                    break;
                case '-':case '~':
                    finalExpr += '<span class="sr-only">minus</span><span aria-hidden="true">−</span>';
                    break;
                case '(':
                    finalExpr += '<span class="sr-only">left parenthesis</span><span aria-hidden="true">(</span>';
                    break;
                case ')':
                    finalExpr += '<span class="sr-only">right parenthesis</span><span aria-hidden="true">)</span>';
                    break;
                default:
                    finalExpr += expr.charAt(i);
            }
        }
        return finalExpr;
    }

    // Source: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
    isNumeric(str) {
        if (typeof str != "string") {
            return false;
        }
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) && // ...and ensure strings of whitespace fail
               isFinite(str);
      }
}
