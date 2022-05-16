export default class Calculator {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.initBtnListeners();
        view.initEmitter({
            'appendToOperand': (data) => model.appendToOperand(data),
            'deleteFromOperand': (data) => model.deleteFromOperand(data)
        });
        model.initEmitter({
            'updateOperand': (data) => view.updateOperand(data),
            'updateExpression': (data) => view.updateExpression(data)
        });
    }
}