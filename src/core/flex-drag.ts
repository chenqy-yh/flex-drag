type FlexDragConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class FlexDrag {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(config: FlexDragConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.init();
  }

  init() {
    console.log("init");
  }
}

export default FlexDrag;
