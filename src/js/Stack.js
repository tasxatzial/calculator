export default class Stack {
    constructor() {
        this.stack = [];
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    top() {
        if (this.stack.length === 0) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    }

    push(obj) {
        this.stack.push(obj);
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error('stack is empty');
        }
        return this.stack.pop();
    }

    clear() {
        this.stack = [];
    }
}
