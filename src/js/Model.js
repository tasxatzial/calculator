export default class Model {
    constructor() {}

    addChangeListener(name, listener) {
        const listeners = this[name];
        if (!listeners) {
            this[name] = [listener];
        } else {
            listeners.push(listener);
        }
    }

    raiseChange(name) {
        var listeners = this[name];
        if (listeners) {
            listeners.forEach(listener => listener());
        }
    }
}