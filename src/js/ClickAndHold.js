export default class ClickAndHold {
    constructor(element, callbacks) {
        this.element = element;
        this.reset = callbacks.reset;
        this.run = callbacks.run;
        this.end = callbacks.end;

        this.timerID = null;
        this.start = null;
        this.previousTimeStamp = null;
        this.done = false;

        this.step = this.step.bind(this);

        ['mousedown', 'touchstart']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            this.onHoldStart();
        }));
        ['mouseup', 'mousleave', 'mouseout', 'touchend', 'touchcancel']
        .forEach(type => this.element.addEventListener(type, (e) => {
            e.preventDefault();
            this.onHoldEnd();
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

    onHoldEnd() {
        cancelAnimationFrame(this.timerID);
        this.start = null;
        this.previousTimeStamp = null;
        this.done = true;
        this.reset(this.element);
    }

    static apply(element, callbacks) {
        new ClickAndHold(element, callbacks);
    }
}