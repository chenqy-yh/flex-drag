import {
  unify,
  calcFlexValue,
  resolveFlexValue,
  toPx,
  calcWithBound,
} from "./utils";
import type { FlexDragConfig, FlexValue } from "./types";
import Dragger from "./drag";
import Resizer from "./resizer";

class FlexDrag {
  el: HTMLElement;
  parEl: HTMLElement;
  _id: number;
  _parElWidth: FlexValue;
  _parElHeight: FlexValue;
  _x: FlexValue;
  _y: FlexValue;
  _width: FlexValue;
  _height: FlexValue;
  _config: FlexDragConfig;
  _observer: ResizeObserver | null = null;
  _autoFlex: boolean;
  _dragger: Dragger;
  _resizer: Resizer;

  static _instanceList: FlexDrag[] = [];
  static _id_count: number = 0;

  static destroyAll() {
    this._instanceList.forEach((instance) => instance.destroy());
  }

  constructor(el: HTMLElement, config: FlexDragConfig) {
    if (!el?.parentElement) {
      throw new Error("HTMLElement and its parent are required");
    }

    this.el = el;
    this.parEl = el.parentElement;
    this._config = { ...config };
    this._id = FlexDrag._id_count++;
    this._dragger = new Dragger(el);

    this.initialize();
  }

  private initialize() {
    this.storeInstance();
    this.initParentEl();
    this.resetParElSize();
    this.updateView();
    this.initResizeObserver();
    this.initDragger();
    this.initResizer();
  }

  private storeInstance() {
    FlexDrag._instanceList.push(this);
  }

  private initDragger() {
    this._dragger.install((dx, dy) => {
      this.updatePosition(dx, dy);
    });
  }

  private initResizer() {
    this._resizer = new Resizer(this.el, (state) => {
      const { top, left, width, height } = state;
      this.updateConfig({ x: left, y: top, width, height });
    });
  }

  private updatePosition(dx: number, dy: number) {
    const new_x_val = calcFlexValue(
      this.x,
      { value: dx, unit: "px" },
      this.parElWidth.value
    ).value;
    const new_y_val = calcFlexValue(
      this.y,
      { value: dy, unit: "px" },
      this.parElHeight.value
    ).value;

    this.x = {
      value: calcWithBound(
        new_x_val,
        this.parElWidth.value - this.width.value,
        0
      ),
      unit: this.x.unit,
    };
    this.y = {
      value: calcWithBound(
        new_y_val,
        this.parElHeight.value - this.height.value,
        0
      ),
      unit: this.y.unit,
    };

    this.updateConfig();
  }

  private initParentEl() {
    Object.assign(this.parEl.style, {
      position: "relative",
      overflow: "hidden",
    });
  }

  private initResizeObserver() {
    this._observer = new ResizeObserver(() => this.onParentResize());
    this._observer.observe(this.parEl);
  }

  private resetParElSize() {
    this._parElWidth = { value: this.parEl.clientWidth, unit: "px" };
    this._parElHeight = { value: this.parEl.clientHeight, unit: "px" };
  }

  private computeConfig() {
    this._x = unify(this._config.x, this.parElWidth.value);
    this._y = unify(this._config.y, this.parElHeight.value);
    this._width = unify(this._config.width, this.parElWidth.value);
    this._height = unify(this._config.height, this.parElHeight.value);
  }

  private setElementStyle() {
    Object.assign(this.el.style, {
      position: "absolute",
      left: `${toPx(this.x, this._parElWidth.value)}px`,
      top: `${toPx(this.y, this._parElHeight.value)}px`,
      width: `${toPx(this.width, this._parElWidth.value)}px`,
      height: `${toPx(this.height, this._parElHeight.value)}px`,
    });
  }

  private updateConfig(config?: Partial<FlexDragConfig>) {
    Object.assign(
      this._config,
      {
        x: `${this.x.value}${this.x.unit}`,
        y: `${this.y.value}${this.y.unit}`,
        width: `${this.width.value}${this.width.unit}`,
        height: `${this.height.value}${this.height.unit}`,
      },
      {
        ...config,
      }
    );
    this.updateView();
  }

  private onParentResize() {
    const w = this.parEl.clientWidth;
    const h = this.parEl.clientHeight;

    if (this.parElWidth.value !== w || this.parElHeight.value !== h) {
      this.parElWidth = `${w}px`;
      this.parElHeight = `${h}px`;
      this.updateView();
    }
  }

  private updateView() {
    this.computeConfig();
    this.setElementStyle();
  }

  attr(
    keyOrConfig: keyof FlexDragConfig | Partial<FlexDragConfig>,
    value?: string
  ) {
    if (typeof keyOrConfig === "object") {
      this.updateConfig(keyOrConfig);
      return;
    }
    if (value === undefined) {
      return this._config[keyOrConfig];
    }
    this.updateConfig({ [keyOrConfig]: value });
  }

  destroy() {
    this._observer?.disconnect();
    FlexDrag._instanceList = FlexDrag._instanceList.filter(
      (instance) => instance !== this
    );
  }

  get parElWidth(): FlexValue {
    return this._parElWidth;
  }

  get parElHeight(): FlexValue {
    return this._parElHeight;
  }

  get x(): FlexValue {
    return this._x;
  }

  get y(): FlexValue {
    return this._y;
  }

  get width(): FlexValue {
    return this._width;
  }

  get height(): FlexValue {
    return this._height;
  }

  set x(value: string | FlexValue) {
    this._x = resolveFlexValue(value, this.parElWidth.value);
  }

  set y(value: string | FlexValue) {
    this._y = resolveFlexValue(value, this.parElHeight.value);
  }

  set width(value: string | FlexValue) {
    this._width = resolveFlexValue(value, this.parElWidth.value);
  }

  set height(value: string | FlexValue) {
    this._height = resolveFlexValue(value, this.parElHeight.value);
  }
  set parElWidth(value: string | FlexValue) {
    this._parElWidth = resolveFlexValue(value, this.parElWidth.value);
  }
  set parElHeight(value: string | FlexValue) {
    this._parElHeight = resolveFlexValue(value, this.parElHeight.value);
  }
}

export default FlexDrag;
