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
}