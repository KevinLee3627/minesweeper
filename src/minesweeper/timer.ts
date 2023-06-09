export class Timer {
  isStarted = false;
  timerElem: HTMLElement;
  reqId = 0;

  timeStep = 1000; // ms
  current = Date.now();
  previousTime = Date.now();
  lag = 0;

  total = 0;

  constructor(timeStep: number) {
    const timerElem = document.getElementById("timer");
    if (timerElem == null) throw new Error("Timer element not found");

    this.timerElem = timerElem;
    this.timerElem.textContent = "0";
    this.timeStep = timeStep;
  }

  start() {
    if (!this.isStarted) {
      this.current = Date.now();
      this.previousTime = Date.now();
      this.isStarted = true;
      this.#step();
    }
  }

  stop() {
    cancelAnimationFrame(this.reqId);
  }

  show() {
    this.timerElem.classList.remove("invisible");
  }

  hide() {
    this.timerElem.classList.add("invisible");
  }

  reset() {
    this.stop();
    this.total = 0;
    this.isStarted = false;
    this.timerElem.textContent = "";
  }

  #update(timeStep: number) {
    this.total += timeStep;

    this.timerElem.textContent = (this.total / 1000).toString(10);
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
