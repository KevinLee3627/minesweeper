export class Timer {
  isStarted = false;
  timerElem: HTMLElement;
  reqId = 0;

  timeStep = 50; // ms
  current = Date.now();
  previousTime = Date.now();
  lag = 0;

  total = 0;

  constructor(timeStep: number) {
    const timerElem = document.getElementById("timer");
    if (timerElem == null) throw new Error("Timer element not found");

    this.timerElem = timerElem;
    this.timeStep = timeStep;
  }

  start() {
    if (!this.isStarted) {
      this.#step();
    }
  }

  stop() {
    cancelAnimationFrame(this.reqId);
  }

  show() {
    this.timerElem.hidden = false;
  }

  hide() {
    this.timerElem.hidden = true;
  }

  #update(timeStep: number) {
    this.total += timeStep;

    this.timerElem.textContent = this.total.toString(10);
  }

  #step() {
    this.current = Date.now();
    const elapsed = this.current - this.previousTime;
    this.previousTime = this.current;
    this.lag += elapsed;
    while (this.lag >= this.timeStep) {
      this.#update(this.timeStep);
      this.lag -= this.timeStep;
    }
    this.reqId = requestAnimationFrame(this.#step.bind(this));
  }
}
