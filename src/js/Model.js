export default class Model {
    constructor() {
        this.listeners = [];
    }

    addChangeListener(listener) {
        this.listeners.push(listener);
    }

    raiseChange() {
        this.listeners.forEach(listener => listener());
    }
}