import View from './View.js';

export default class CalculationHistoryView extends View {
    constructor(elements) {
        super();
        this.calculationHistoryListContainer = elements.calculationHistoryListContainer;
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
            this.calculationHistoryListContainer.innerHTML = `<p class='no-history-msg'>There's no history yet</p>`;
        } else {
            this.calculationHistoryListContainer.innerHTML = '';
            this.calculationHistoryListContainer.appendChild(ul);
        }
    }

    createCalculation(key, value) {
        return `<li class='history-list-item' data-id='${key}'>
                  <button class='output output-history'>
                    <span class='expression-container expression-container-history'>${this.formatExpression(value.expression)}</span>
                    <span class='sr-only'>=</span>
                    <span class='result result-history'>${this.formatNumber(value.result)}</span>
                  </button>
                </li>`;
    }

    bindLoadCalculation(handler) {
        this.calculationHistoryListContainer.addEventListener('click', (event) => {
            if (event.target.closest('li')) {
                handler(event.target.closest('li').dataset.id);
            }
        });
    }
}