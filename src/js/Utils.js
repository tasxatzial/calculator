export default class Utils {
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

    static hasPressedSpace(keyName) {
        return keyName === ' ' || keyName === 'Spacebar';
    }

    static hasPressedEnter(keyName) {
        return keyName === 'Enter';
    }
}