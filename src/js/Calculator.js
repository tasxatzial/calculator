export default class Calculator {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.initBtnListeners();
    }
}