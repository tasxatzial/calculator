import KeyboardUtils from './KeyboardUtils.js';

export default class ClickAndHold {
    constructor(element, callbacks) {
        this.element = element;
        this.reset = callbacks.reset;
        this.run = callbacks.run;
        this.end = callbacks.end;

        this.timerID = null;
        this.start = null;
        this.previousTimeStamp = null;
        this.done = true;

        this.step = this.step.bind(this);
        this.keydownListener = this.keydownListener.bind(this);

        this.addHoldStartListeners();
        this.addHoldEndListeners();
    }

    keydownListener(e) {
        e.preventDefault();
        const keyName = KeyboardUtils.getKeyName(e);
        if (KeyboardUtils.hasPressedSpace(keyName) || KeyboardUtils.hasPressedEnter(keyName)) {
            this.element.removeEventListener('keydown', this.keydownListener);
            this.onHoldStart();
        }
    }

    addHoldStartListeners() {
        this.element.addEventListener('keydown', this.keydownListener);
        ['mousedown', 'touchstart']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            this.onHoldStart();
        }));
    }

    addHoldEndListeners() {
        ['keyup']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            const keyName = KeyboardUtils.getKeyName(e);
            if (KeyboardUtils.hasPressedSpace(keyName) || KeyboardUtils.hasPressedEnter(keyName)) {
                this.onHoldEnd(e.type);
            }
        }));
        ['mouseup', 'mousleave', 'mouseout', 'touchend', 'touchcancel']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            this.onHoldEnd(e.type);
        }));
    }

    step(timestamp) {
        if (this.start === null) {
            this.start = timestamp;
        }
        const elapsed = timestamp - this.start;
    
        if (this.previousTimeStamp !== timestamp) {
            const count = Math.min(0.1 * elapsed, 100); //make sure count stops at exactly 100
            this.run(this.element, count);
            if (count === 100) {
                this.done = true;
            }
          }
        
          if (this.done) {
              this.end(this.element);
          } else if (elapsed < 1000) { //Stop the animation after 1 second
            this.previousTimeStamp = timestamp;
            this.timerID = window.requestAnimationFrame(this.step);
          }
    }

    onHoldStart() {
        this.done = false;
        requestAnimationFrame(this.step);
    }

    onHoldEnd(eventType) {
        cancelAnimationFrame(this.timerID);
        this.start = null;
        this.previousTimeStamp = null;
        this.done = true;
        if (eventType === 'keyup') {
            this.element.addEventListener('keydown', this.keydownListener);
        }
        this.reset(this.element);
    }

    static apply(element, callbacks) {
        new ClickAndHold(element, callbacks);
    }
}