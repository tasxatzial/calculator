/* Source: https://github.com/tasxatzial/click-and-hold-component/blob/master/src/js/ClickAndHold.js */

import KeyboardUtils from './KeyboardUtils.js';

export default class ClickAndHold {
    constructor(element, callbacks, duration) {
        this.element = element;
        this.duration = duration;
        this.reset = callbacks.reset;
        this.run = callbacks.run;
        this.end = callbacks.end;

        this.initState();
        
        this.step = this.step.bind(this);
        this.keydownListener = this.keydownListener.bind(this);

        this.addHoldStartListeners();
        this.addHoldEndListeners();
    }

    static apply(element, callbacks, duration) {
        new ClickAndHold(element, callbacks, duration);
    }

    initState() {
        this.done = true;
        this.timerID = null;
        this.start = null;
        this.previousTimeStamp = null;
    }

    addHoldStartListeners() {
        this.element.addEventListener('keydown', this.keydownListener);
        ['mousedown', 'touchstart']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            this.onHoldStart();
        }));
    }

    keydownListener(e) {
        const keyName = KeyboardUtils.getKeyName(e);
        if (KeyboardUtils.is_Space(keyName)) {
            e.preventDefault();
            this.element.removeEventListener('keydown', this.keydownListener);
            this.onHoldStart();
        }
    }

    onHoldStart() {
        this.done = false;
        window.requestAnimationFrame(this.step);
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

    onHoldEnd(eventType) {
        window.cancelAnimationFrame(this.timerID);
        this.start = null;
        this.previousTimeStamp = null;
        this.done = true;
        if (eventType === 'keyup' || eventType === 'blur') {
            this.element.addEventListener('keydown', this.keydownListener);
        }
        this.reset(this.element);
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
              this.initState();
              this.reset(this.element);
              this.end(this.element);
          } else {
              this.previousTimeStamp = timestamp;
              this.timerID = window.requestAnimationFrame(this.step);
          }
    }
}
