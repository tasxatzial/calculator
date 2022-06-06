import View from './View.js';

export default class CalculationHistoryView extends View {
    constructor(elements) {
        super();
        this.calculationHistoryListContainer = elements.calculationHistoryListContainer;
    }

    render(data) {
        const ul = document.createElement('ul');
        ul.classList = 'calc-history-list';
        for (let [key, value] of Object.entries(data)) {
            const calculation = this.createCalculation(key, value);
            ul.insertAdjacentHTML('beforeend', calculation);
        }
        this.calculationHistoryListContainer.innerHTML = '';
        this.calculationHistoryListContainer.appendChild(ul);
    }

    createCalculation(key, value) {
        return `<li class='calc-history-list-item' id='${key}'>
                  <button class='calc-history-list-btn-item'>
                    <div class='calc-history-expression'>${this.formatExpression(value.expression)}=</div>
                    <div class='calc-history-result'>${this.formatNumber(value.result)}</div>
                  </button>
                </li>`;
    }
}