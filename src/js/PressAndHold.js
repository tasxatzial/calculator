import KeyboardUtils from './KeyboardUtils.js';

export default class PressAndHold {
    constructor(element, callbacks, duration) {
        this.element = element;
        this.duration = duration;
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
        const keyName = KeyboardUtils.getKeyName(e);
        if (KeyboardUtils.is_Space(keyName)) {
            e.preventDefault();
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
            const keyName = KeyboardUtils.getKeyName(e);
            if (KeyboardUtils.is_Space(keyName)) {
                e.preventDefault();
                this.onHoldEnd(e.type);
            }
        }));
        ['blur', 'mouseup', 'mousleave', 'mouseout', 'touchend', 'touchcancel']
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
            const count = Math.min(elapsed * 100 / this.duration, 100);
            this.run(this.element, count);
            if (count === 100) {
                this.done = true;
            }
          }
        
          if (this.done) {
              this.end(this.element);
          } else {
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
        if (eventType === 'keyup' || eventType === 'blur') {
            this.element.addEventListener('keydown', this.keydownListener);
        }
        this.reset(this.element);
    }

    static apply(element, callbacks, duration) {
        new PressAndHold(element, callbacks, duration);
    }
}