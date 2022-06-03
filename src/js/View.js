export default class View {
    constructor() {}

    formatNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber.includes('e')) {
            return stringNumber;
        }
        const splitNumber = stringNumber.split('.');
        const integerPart = splitNumber[0];
        const decimalPart = splitNumber[1];
        const formattedIntegerPart = parseFloat(integerPart).toLocaleString('en', {
            maximumFractionDigits: 0
        });
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