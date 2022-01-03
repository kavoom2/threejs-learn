import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 1000 / 60; // *60FPS* [ms]

    this.tick();
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = currentTime - this.start;

    // event emitting
    this.trigger("tick");

    // request next frame
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
