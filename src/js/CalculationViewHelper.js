export default class CalculationViewHelper {
    constructor() {}

    static formatNumberString(str) {
        if (!CalculationViewHelper.isNumeric(str) || str.includes('e')) {
            return str;
        }
        const [wholePart, fractionalPart] = str.split('.');
        const isNegative = wholePart[0] === '-';
        const positiveNumber = isNegative ? wholePart.substring(1) : wholePart;
        let formattedIntegerPart = positiveNumber.split('').reverse()
            .reduce((res, val, index) => {
                if ((index + 1) % 3 === 0 && index !== positiveNumber.length - 1) {
                    return ',' + val + res;
                } else {
                    return val + res;
                }
            });
        if (isNegative) {
            formattedIntegerPart = '-' + formattedIntegerPart;
        }
        if (fractionalPart !== undefined) {
            return formattedIntegerPart + '.' + fractionalPart;
        } else {
            return formattedIntegerPart;
        }
    }

    static formatExpression(expressionTokens) {
        let expr = '';
        expressionTokens.forEach(token => {
            switch(token) {
                case '/':
                    expr += '<span class="sr-only">divided by</span><span aria-hidden="true">÷</span>';
                    break;
                case '*':
                    expr += '<span class="sr-only">times</span><span aria-hidden="true">×</span>';
                    break;
                case '+':
                    expr += '<span class="sr-only">plus</span><span aria-hidden="true">+</span>';
                    break;
                case '-':case '~':
                    expr += '<span class="sr-only">minus</span><span aria-hidden="true">−</span>';
                    break;
                case '(':
                    expr += '<span class="sr-only">left parenthesis</span><span aria-hidden="true">(</span>';
                    break;
                case ')':
                    expr += '<span class="sr-only">right parenthesis</span><span aria-hidden="true">)</span>';
                    break;
                default:
                    expr +=  CalculationViewHelper.formatNumberString(token);
            }
        });
        return expr;
    }

    // Source: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number/#answer-175787
    // Credit: https://stackoverflow.com/users/17121
    static isNumeric(str) {
        if (typeof str !== 'string') {
            return false;
        }
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) && // ...and ensure strings of whitespace fail
               isFinite(str);
    }
}
