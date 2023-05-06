import ViewUtils from './ViewUtils.js';

export default class CalculationHistoryView {
    constructor(calcElement) {
        this.calcHistoryListContainer = calcElement.querySelector('.history-list-container');
    }

    render(data) {
        const ul = document.createElement('ul');
        ul.classList = 'history-list';
        const keys = Object.keys(data).sort((a,b) => b - a);

        for (let key of keys) {
            const calculation = this.createCalculation(key, data[key]);
            ul.insertAdjacentHTML('beforeend', calculation);
        }

        if (ul.children.length === 0) {
            this.calcHistoryListContainer.innerHTML = `<p class='no-history-msg'>There's no history yet</p>`;
        } else {
            this.calcHistoryListContainer.innerHTML = '';
            this.calcHistoryListContainer.appendChild(ul);
        }
    }

    createCalculation(key, value) {
        return `<li class='history-list-item' data-id='${key}'>
                  <button class='output output-history'>
                    <span class='expression-container expression-container-history'>${ViewUtils.formatExpression(value.expression)}</span>
                    <span class='sr-only'>=</span>
                    <span class='result result-history'>${ViewUtils.formatNumber(value.result)}</span>
                  </button>
                </li>`;
    }
}