import Camera from "./Camera";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";

export default class Experience {
  constructor(canvas) {
    // Enable to global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    this.sizes.on("resize", () => {
      // on Canvas Resize Event
      this.resize();
    });

    this.time.on("tick", () => {
      // on Request Animation Frame
      this.update();
    });
  }

  resize() {}

  update() {}
}
