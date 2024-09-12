class Dragger {
  private onMove: boolean;
  private el: HTMLElement;

  private handleMouseDown: (evt: MouseEvent) => void;
  private handleMouseUp: (evt: MouseEvent) => void;
  private handleMouseMove: (evt: MouseEvent) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.style.userSelect = "none";
    this.onMove = false;
  }

  install(onMove: (dx: number, dy: number) => void) {
    this.handleMouseDown = (e: MouseEvent) => {
      this.onMove = true;
      e.stopPropagation();
    };
    this.handleMouseMove = (e: MouseEvent) => {
      if (this.onMove) {
        onMove(e.movementX, e.movementY);
      }
      e.stopPropagation();
    };
    this.handleMouseUp = (e) => {
      this.onMove = false;
      e.stopPropagation();
    };
    this.el.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  destroy() {
    this.el.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
  }
}

export default Dragger;
