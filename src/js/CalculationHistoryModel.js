import Model from './Model.js';

export default class CalculationHistoryModel extends Model {
    constructor(calculationList) {
        super();
        if (calculationList) {
            this.calculationList = calculationList;
            this.id = Object.keys(calculationList).length;
        } else {
            this.calculationList = {};
            this.id = 0;
        }
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
        this.id = 0;
        this.raiseChange("changeState");
    }

    toJSON() {
        return this.calculationList;
    }
}