export default class CalculationHistoryView {
    constructor() {}

    update(data) {
        const ul = document.createElement('ul');
        for (let [key, value] of Object.entries(data)) {
            const calculationEl = this.createCalculation(key, value);
            ul.insertAdjacentHTML('beforeend', calculationEl);
        }
        return ul;
    }

    createCalculation(key, value) {
        return `<li id="${key}">
                  <div>${value.expression}</div>
                  <div>${value.result}</div>
                </li>`;
    }
}