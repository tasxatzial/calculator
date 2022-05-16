import EventEmmiter from './EventEmitter.js'

export default class CalculatorModel {
    constructor() {
        this.eventEmmiter = new EventEmmiter();
        this.operand = 0;
        this.expression = '0';
    }

    initEmitter(callbacks) {
        this.eventEmmiter.on("updateOperand", data => callbacks.updateOperand(data));
        this.eventEmmiter.on("updateExpression", data => callbacks.updateExpression(data));
        this.eventEmmiter.dispatch("updateOperand", {
            'operand': this.getOperand()
        });
        this.eventEmmiter.dispatch("updateExpression", {
            'expression': this.getExpression()
        });
    }

    getOperand() {
        return this.operand;
    }

    getExpression() {
        return this.expression;
    }

    appendToOperand({operand, digit}) {
        let newOperand;
        if (operand === '0') {
            newOperand = digit;
        } else {
            newOperand = operand + digit;
        }
        this.eventEmmiter.dispatch("updateOperand", {
            'operand': newOperand
        });
    }

    deleteFromOperand({operand}) {
        if (operand.length === 1) {
            this.eventEmmiter.dispatch("updateOperand", {
                'operand': 0
            });
        } else {
            this.eventEmmiter.dispatch("updateOperand", {
                'operand': operand.toString().slice(0, -1)
            });
        }
    }
}