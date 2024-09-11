import { genId, unify } from "./utils";
import { FlexDragConfig, FlexValue } from "./types";
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
  _observer: ResizeObserver | null;

  static _instanceList: FlexDrag[] = [];
  static _id_count: number = 0;
  static destoryAll() {
    for (const instance of this._instanceList) {
      instance.destory();
    }
  }

  constructor(el: HTMLElement, config: FlexDragConfig) {
    if (!el) {
      throw new Error("html element is required");
    }
    if (!el.parentElement) {
      throw new Error("html element must have a parent node");
    }
    this._config = config;
    this._id = FlexDrag._id_count;
    this.el = el;
    this.parEl = this.el.parentElement!;

    this._parElWidth = { value: 0, unit: "px" };
    this._parElHeight = { value: 0, unit: "px" };
    this._x = { value: 0, unit: "px" };
    this._y = { value: 0, unit: "px" };
    this._width = { value: 0, unit: "px" };
    this._height = { value: 0, unit: "px" };
    this._observer = null;

    this.init();
  }
  private init() {
    FlexDrag._id_count += 1;
    FlexDrag._instanceList.push(this);
    this.resetParElSize();
    this.computedConfig();
    this.setElStyle();
    this.parEl.style.position = "relative";
    this.parEl.style.overflow = "hidden";
    this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.onParResize();
      }
    });
    this._observer.observe(this.parEl);
  }

  resetParElSize() {
    this._parElWidth = { value: this.parEl.clientWidth, unit: "px" };
    this._parElHeight = { value: this.parEl.clientHeight, unit: "px" };
  }

  computedConfig() {
    this._x = unify(this._config.x, this.parElWidth.value);
    this._y = unify(this._config.y, this.parElHeight.value);
    this._width = unify(this._config.width, this.parElWidth.value);
    this._height = unify(this._config.height, this.parElHeight.value);
  }

  initStyle() {
    this.el.style.position = "absolute";
    this.el.style.left = this.x.value + this.x.unit;
    this.el.style.top = this.y.value + this.y.unit;
    this.el.style.width = this.width.value + this.width.unit;
    this.el.style.height = this.height.value + this.height.unit;
  }

  private setElStyle() {
    this.el.style.position = "absolute";
    this.el.style.left = `${this.x.value}px`;
    this.el.style.top = `${this.y.value}px`;
    this.el.style.width = `${this.width.value}px`;
    this.el.style.height = `${this.height.value}px`;
  }

  onParResize() {
    const w = this.parEl.clientWidth;
    const h = this.parEl.clientHeight;

    if (this.parElWidth.value !== w || this.parElHeight.value !== h) {
      this.parElWidth = `${w}px`;
      this.parElHeight = `${h}px`;
      this.computedConfig();
      this.setElStyle();
    }
  }
  destory() {
    this._observer && this._observer.disconnect();
    const index = FlexDrag._instanceList.indexOf(this);
    if (index !== -1) {
      FlexDrag._instanceList.splice(index, 1);
    }
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

  set x(value: string) {
    this._x = unify(value, this.parElWidth.value);
  }

  set y(value: string) {
    this._y = unify(value, this.parElHeight.value);
  }

  set width(value: string) {
    this._width = unify(value, this.parElWidth.value);
  }

  set height(value: string) {
    this._height = unify(value, this.parElHeight.value);
  }
  set parElWidth(value: string) {
    this._parElWidth = unify(value, this.parElWidth.value);
  }
  set parElHeight(value: string) {
    this._parElHeight = unify(value, this.parElHeight.value);
  }
}

export default FlexDrag;
