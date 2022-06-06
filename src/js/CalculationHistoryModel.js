import Model from './Model.js';

export default class CalculationHistoryModel extends Model {
    constructor() {
        super();
        this.id = 0;
        this.calculationList = {};
    }

    add(calculation) {
        this.calculationList[this.id++] = calculation;
        this.raiseChange("changeState");
    }

    get(id) {
        return this.calculationList[id];
    }

    clearHistory() {
        this.calculationList = {};
        this.raiseChange("changeState");
    }

    toJSON() {
        return this.calculationList;
    }
}