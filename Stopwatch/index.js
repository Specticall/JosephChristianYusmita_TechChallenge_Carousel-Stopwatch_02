class Timer {
  #previousTime = 0;
  #startTimestamp = 0;
  #timestamp = 0;
  #callback;
  #intervalRef;
  #intervalMs;
  /**
   * @type {"paused" | "running" | "idle"}
   */
  status = "idle";

  constructor({ onUpdate, intervalMs = 1000 }) {
    this.#callback = onUpdate;
    this.#intervalMs = intervalMs;
  }

  getNewTimestampDetails() {
    this.#timestamp = Date.now() - this.#startTimestamp + this.#previousTime;

    return {
      hour: Math.trunc(this.#timestamp / (1000 * 60 * 60)) % 24,
      minute: Math.trunc(this.#timestamp / (1000 * 60)) % 60,
      second: Math.trunc(this.#timestamp / 1000) % 60,
    };
  }

  start() {
    if (this.#intervalIsRunning()) return;
    this.#startTimestamp = Date.now();

    this.#intervalRef = setInterval(() => {
      const timestampDetails = this.getNewTimestampDetails();

      this.#callback(timestampDetails);
    }, this.#intervalMs);

    this.status = "running";
  }

  pause() {
    this.#previousTime = this.#timestamp;
    this.#stopTimeout();

    this.status = "paused";
  }

  stop() {
    this.#stopTimeout();
    this.#previousTime = 0;
    this.#timestamp = 0;

    const timestampDetails = this.getNewTimestampDetails();
    this.#callback(timestampDetails);

    this.status = "idle";
  }

  #stopTimeout() {
    clearInterval(this.#intervalRef);
    this.#intervalRef = undefined;
  }

  #intervalIsRunning() {
    return this.#intervalRef !== undefined;
  }
}

const hourEl = document.querySelector(".hour");
const minuteEl = document.querySelector(".minute");
const secondEl = document.querySelector(".second");

const startButton = document.querySelector(".cta.start");
const stopButton = document.querySelector(".cta.stop");
const pauseButton = document.querySelector(".cta.pause");
const ctaContainer = document.querySelector(".cta-container");
const badgeEl = document.querySelector(".badge");

const formatTwoDigit = (number) => {
  return number <= 9 ? `0${number}` : `${number}`;
};

/**
 * @type {(status: "paused" | "running" | "idle") => void}
 */
const updateButtonLayout = (status) => {
  startButton.classList.remove("inactive");
  pauseButton.classList.remove("inactive");
  stopButton.classList.remove("inactive");
  ctaContainer.classList.remove("single-element");

  switch (status) {
    case "idle":
      pauseButton.classList.add("inactive");
      stopButton.classList.add("inactive");
      ctaContainer.classList.add("single-element");
      badgeEl.textContent = "Press To Start Timer";
      break;
    case "paused":
      badgeEl.textContent = "Press To Resume Timer";
      pauseButton.classList.add("inactive");
      break;
    case "running":
      badgeEl.textContent = "Timer Running";
      startButton.classList.add("inactive");
      break;
  }
};

const timer = new Timer({
  onUpdate: (timestamp) => {
    hourEl.textContent = formatTwoDigit(timestamp.hour);
    minuteEl.textContent = formatTwoDigit(timestamp.minute);
    secondEl.textContent = formatTwoDigit(timestamp.second);
  },
});

startButton.addEventListener("click", () => {
  timer.start();
  updateButtonLayout(timer.status);
});

stopButton.addEventListener("click", () => {
  timer.stop();
  hourEl.textContent = "00";
  minuteEl.textContent = "00";
  secondEl.textContent = "00";
  updateButtonLayout(timer.status);
});

pauseButton.addEventListener("click", () => {
  timer.pause();
  updateButtonLayout(timer.status);
});

updateButtonLayout(timer.status);
