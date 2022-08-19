export default class View {
    constructor() {}

    formatNumber(numberString) {
        if (numberString === '') {
            return '';
        }
        if (numberString.includes('e')) {
            return numberString;
        }
        const splitNumber = numberString.split('.');
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
        expr = expr.replace(/\//g, '÷').replace(/\*/g, '×').replace(/[-~]/g, '−');
        return expr;
    }
}