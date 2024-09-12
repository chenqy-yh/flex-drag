import Dragger from "./drag";

const POINT_SIZE = 8;
const POINT_ZINDEX = 999;

const controlsConfig = [
  { ratio: [0, 0], cursor: "se-resize", size: { w: 0, h: 0 } },
  { ratio: [0.5, 0], cursor: "ns-resize", size: { w: 1, h: 0 } },
  { ratio: [1, 0], cursor: "ne-resize", size: { w: 0, h: 0 } },
  { ratio: [0, 0.5], cursor: "ew-resize", size: { w: 0, h: 1 } },
  { ratio: [1, 0.5], cursor: "ew-resize", size: { w: 0, h: 1 } },
  { ratio: [0, 1], cursor: "ne-resize", size: { w: 0, h: 0 } },
  { ratio: [0.5, 1], cursor: "ns-resize", size: { w: 1, h: 0 } },
  { ratio: [1, 1], cursor: "se-resize", size: { w: 0, h: 0 } },
];

type ResizeState = {
  top?: string;
  left?: string;
  width?: string;
  height?: string;
};

type ResizeCallback = (state: ResizeState) => void;

class Resizer {
  private el: HTMLElement;
  private controlPoints: HTMLElement[] = [];
  private resizeObserver!: ResizeObserver;
  private draggers: Dragger[] = [];
  private resizeCallback: ResizeCallback;

  constructor(el: HTMLElement, resizeCallback: ResizeCallback) {
    this.el = el;
    this.resizeCallback = resizeCallback;
    this.initialize();
  }

  private initialize() {
    this.ensureElementPosition();
    this.addControlPoints();
    this.initObserver();
    this.initControlListeners();
  }

  private ensureElementPosition() {
    const position = this.el.style.position;
    if (!["relative", "absolute"].includes(position)) {
      this.el.style.position = "relative";
    }
  }

  private initObserver() {
    this.resizeObserver = new ResizeObserver(() => this.updateControlPoints());
    this.resizeObserver.observe(this.el);
  }

  private initControlListeners() {
    this.controlPoints.forEach((point, index) => {
      const dragger = new Dragger(point);
      dragger.install((dx, dy) => this.handleDrag(dx, dy, index));
      this.draggers.push(dragger);
    });
  }

  private handleDrag(dx: number, dy: number, index: number) {
    console.log("dx", dx, "dy", dy, "index", index);
    const elWidth = this.el.offsetWidth;
    const elHeight = this.el.offsetHeight;
    let newWidth = elWidth,
      newHeight = elHeight;
    let newTop = this.el.offsetTop,
      newLeft = this.el.offsetLeft;

    // Adjust height and top
    if ([0, 1, 2].includes(index)) {
      newHeight -= dy;
      newTop += dy;
    }
    // Adjust width and left
    if ([0, 3, 5].includes(index)) {
      newWidth -= dx;
      newLeft += dx;
    }
    // Expand width
    if ([2, 4, 7].includes(index)) {
      newWidth += dx;
    }
    // Expand height
    if ([5, 6, 7].includes(index)) {
      newHeight += dy;
    }

    this.updateElementSize(newTop, newLeft, newWidth, newHeight);
  }

  private updateElementSize(
    top: number,
    left: number,
    width: number,
    height: number
  ) {
    console.log("top", top, "left", left, "width", width, "height", height);
    this.resizeCallback({
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
  }

  private updateControlPoints() {
    const elWidth = this.el.offsetWidth;
    const elHeight = this.el.offsetHeight;

    this.controlPoints.forEach((point, index) => {
      const config = controlsConfig[index];
      point.style.width = `${
        config.size.w ? elWidth - POINT_SIZE * 2 : POINT_SIZE
      }px`;
      point.style.height = `${
        config.size.h ? elHeight - POINT_SIZE * 2 : POINT_SIZE
      }px`;
      point.style.left = `${elWidth * config.ratio[0]}px`;
      point.style.top = `${elHeight * config.ratio[1]}px`;
    });
  }

  private addControlPoints() {
    const elWidth = this.el.offsetWidth;
    const elHeight = this.el.offsetHeight;

    this.controlPoints = controlsConfig.map((config, index) => {
      const point = document.createElement("div");
      this.applyControlPointStyles(point, config, elWidth, elHeight);
      this.el.appendChild(point);
      return point;
    });
  }

  private applyControlPointStyles(
    point: HTMLElement,
    config: { ratio: number[]; cursor: string; size: { w: number; h: number } },
    elWidth: number,
    elHeight: number
  ) {
    point.style.position = "absolute";
    point.style.cursor = config.cursor;
    point.style.width = `${
      config.size.w ? elWidth - POINT_SIZE * 2 : POINT_SIZE
    }px`;
    point.style.height = `${
      config.size.h ? elHeight - POINT_SIZE * 2 : POINT_SIZE
    }px`;
    point.style.left = `${elWidth * config.ratio[0]}px`;
    point.style.top = `${elHeight * config.ratio[1]}px`;
    point.style.backgroundColor = "transparent";
    point.style.zIndex = POINT_ZINDEX.toString();
    point.style.transform = "translate(-50%, -50%)";
  }

  destroy() {
    this.controlPoints.forEach((point) => this.el.removeChild(point));
    this.resizeObserver.disconnect();
  }
}

export default Resizer;
