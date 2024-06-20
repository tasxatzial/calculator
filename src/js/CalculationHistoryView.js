import CalculationViewHelper from './CalculationViewHelper.js';

export default class CalculationHistoryView {
    constructor(calcElement) {
        this.calcHistoryListContainer = calcElement.querySelector('.history-list-container');
    }

    render(data) {
        const ul = document.createElement('ul');
        ul.classList = 'history-list';
        const keys = Object.keys(data).sort((a,b) => b - a);

        for (let key of keys) {
            const calculation = this._createCalculation(key, data[key]);
            ul.insertAdjacentHTML('beforeend', calculation);
        }

        if (ul.children.length === 0) {
            this.calcHistoryListContainer.innerHTML = this._getNoHistoryHtml('There\'s no history');
        } else {
            this.calcHistoryListContainer.removeAttribute('aria-live');
            this.calcHistoryListContainer.innerHTML = '';
            this.calcHistoryListContainer.appendChild(ul);
        }
    }

    _getNoHistoryHtml(msg) {
        return `<p class='no-history-msg'>${msg}</p>`;
    }

    clear() {
        this.calcHistoryListContainer.setAttribute('aria-live', 'polite');
        this.calcHistoryListContainer.innerHTML = this._getNoHistoryHtml('History cleared');
    }

    _createCalculation(key, value) {
        return `<li class="history-list-item" data-id="${key}">
                  <button class="output output-history">
                    <div class="expression-container expression-container-history">
                      <span class="expression expression-history">${CalculationViewHelper.formatExpression(value.expressionTokens)}</span>
                      <span class="sr-only">=</span>
                    </div>
                    <div class="result result-history">${CalculationViewHelper.formatNumberString(value.result)}</div>
                  </button>
                </li>`;
    }
}