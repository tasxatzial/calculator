import EventEmmiter from './EventEmitter.js'

export default class CalculatorModel {
    constructor() {
        this.eventEmmiter = new EventEmmiter();
        this.operand = 0;
        this.expression = '0';
    }

    initEmitter(callbacks) {
        this.eventEmmiter.on("updateDisplay", data => callbacks.updateDisplay(data));
        this.eventEmmiter.dispatch("updateDisplay", this.getData());
    }

    getData() {
        return {
            'operand': this.operand,
            'expression': this.expression
        };
    }

    deleteFromOperand() {
        /* todo: do not permit deleting if operand is a result */

        if (this.operand < 10) {
            this.operand = 0;
            this.eventEmmiter.dispatch("updateDisplay", this.getData());
            return;
        }
        const newOperand = parseFloat(this.operand.toString().slice(0, -1));
        this.operand = newOperand;
        this.eventEmmiter.dispatch("updateDisplay", this.getData());
    }
}