export default class CalculationHistoryView {
    constructor(elements) {
        this.calculationHistoryList = elements.calculationHistoryList;
    }

    render(data) {
        const ul = document.createElement('ul');
        for (let [key, value] of Object.entries(data)) {
            const calculation = this.createCalculation(key, value);
            ul.insertAdjacentHTML('beforeend', calculation);
        }
        this.calculationHistoryList.innerHTML = '';
        this.calculationHistoryList.appendChild(ul);
    }

    createCalculation(key, value) {
        return `<li id="${key}">
                  <div>${value.expression}</div>
                  <div>${value.result}</div>
                </li>`;
    }
}