import Model from './Model.js';

export default class CalculationHistoryModel extends Model {
    constructor(calcList) {
        super();
        if (calcList) {
            this.calcList = calcList;
            this.id = Object.keys(calcList).length;
        } else {
            this.calcList = {};
            this.id = 0;
        }
    }

    add(calculation) {
        const lastCalculation = this.calcList[this.id - 1];
        if (this.id === 0 || lastCalculation.expression !== calculation.expression) {
              this.calcList[this.id++] = calculation;
              this.raiseChange("changeState");
        }
    }

    get(id) {
        return this.calcList[id];
    }

    clearHistory() {
        this.calcList = {};
        this.id = 0;
        this.raiseChange("historyClear");
    }

    getHistory() {
        return this.calcList;
    }
}