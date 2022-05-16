export default class Calculator {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.initBtnListeners();
        view.initEmitter({
            'delete': () => model.deleteFromOperand()
        });
        model.initEmitter({
            'updateDisplay': (data) => view.updateDisplay(data)
        });
    }
}