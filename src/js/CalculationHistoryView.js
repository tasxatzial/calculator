import View from './View.js';

export default class CalculationHistoryView extends View {
    constructor(elements) {
        super();
        this.calculationHistoryListContainer = elements.calculationHistoryListContainer;
    }

    render(data) {
        const ul = document.createElement('ul');
        ul.classList = 'calc-history-list';
        const keys = Object.keys(data).sort((a,b) => b - a);

        for (let key of keys) {
            const calculation = this.createCalculation(key, data[key]);
            ul.insertAdjacentHTML('beforeend', calculation);
        }

        if (ul.children.length === 0) {
            this.calculationHistoryListContainer.innerHTML = `<p class='calc-no-history'>There's no history yet</p>`;
        } else {
            this.calculationHistoryListContainer.innerHTML = '';
            this.calculationHistoryListContainer.appendChild(ul);
        }
    }

    createCalculation(key, value) {
        return `<li class='calc-history-list-item' data-id='${key}'>
                  <button class='calc-btn-history-calculation'>
                    <div class='calc-history-expression'>${this.formatExpression(value.expression)}=</div>
                    <div class='calc-history-result'>${this.formatNumber(value.result)}</div>
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