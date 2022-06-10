export default class KeyboardUtils {
    constructor() {}

    static getKeyName(event) {
        let pressedKey;
        if (event.key) {
            pressedKey = event.key;
        } else if (event.keyCode) {
            pressedKey = String.fromCharCode(event.keyCode);
        }
        return pressedKey;
    }

    static hasPressed_Space(keyName) {
        return keyName === ' ' || keyName === 'Spacebar';
    }

    static hasPressed_Enter(keyName) {
        return keyName === 'Enter';
    }

    static hasPressed_H(keyName) {
        return keyName === 'H' || keyName === 'h';
    }
}