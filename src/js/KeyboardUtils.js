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

    static is_Space(keyName) {
        return keyName === ' ' || keyName === 'Spacebar';
    }

    static is_Enter(keyName) {
        return keyName === 'Enter';
    }

    static is_H(keyName) {
        return keyName === 'H' || keyName === 'h';
    }
}