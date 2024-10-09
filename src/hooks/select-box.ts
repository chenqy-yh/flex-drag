import { RefObject, useEffect, useRef } from "react";
import { useSelectedNodeStore } from "@/store";
import { useNodesStore } from "@/store";

type SelectState = {
  x: number;
  y: number;
  width: string;
  height: string;
};

type Pos = [number, number];

const SelectBoxCls = "__select-box";
const selectStyle = {
  position: "absolute",
  border: "1px dashed #000",
  backgroundColor: "rgba(0, 0, 0, 0.03)",
};

// Utility to apply styles
const applyStyles = (
  element: HTMLElement | null,
  styles: Partial<CSSStyleDeclaration>
) => {
  if (element) Object.assign(element.style, styles);
};

// Utility to calculate selection box dimensions and position
const calculateSelectionBox = (
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  offsetX: number,
  offsetY: number
) => {
  const dx = currentX - offsetX - startX;
  const dy = currentY - offsetY - startY;

  const width = Math.abs(dx);
  const height = Math.abs(dy);

  const left = dx >= 0 ? startX : startX - width;
  const top = dy >= 0 ? startY : startY - height;

  return { left, top, width, height };
};

// Utility to check if a node is within the selection area
const isNodeInSelection = (
  nodeA: [number, number],
  nodeB: [number, number],
  selectionA: [number, number],
  selectionB: [number, number]
) => {
  const onTop = selectionB[1] < nodeA[1] && selectionA[1] < nodeA[1];
  const onBottom = selectionA[1] > nodeB[1] && selectionB[1] > nodeB[1];
  const onLeft = selectionB[0] < nodeA[0] && selectionA[0] < nodeA[0];
  const onRight = selectionA[0] > nodeB[0] && selectionB[0] > nodeB[0];

  return !(onTop || onBottom || onLeft || onRight);
};

export const useSelectBox = (containerRef: RefObject<HTMLElement>) => {
  const isSelecting = useRef(false);
  const { addNodeToSelected, removeNodeFromSelected } = useSelectedNodeStore();
  const startState = useRef<SelectState>({
    x: 0,
    y: 0,
    width: "0",
    height: "0",
  });
  const { nodes } = useNodesStore();

  const handleMouseDown = (e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    isSelecting.current = true;
    const { clientX, clientY } = e;
    const { offsetLeft, offsetTop } = container;

    startState.current = {
      x: clientX - offsetLeft,
      y: clientY - offsetTop,
      width: "0",
      height: "0",
    };

    const selectBox = document.createElement("div");
    selectBox.className = SelectBoxCls;

    applyStyles(selectBox, {
      left: `${clientX}px`,
      top: `${clientY}px`,
      width: "0",
      height: "0",
      ...selectStyle,
    });

    container.appendChild(selectBox);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isSelecting.current) return;

    const container = containerRef.current;
    if (!container) return;

    const { clientX, clientY } = e;
    const { x, y } = startState.current;
    const { offsetLeft, offsetTop } = container;

    const { left, top, width, height } = calculateSelectionBox(
      x,
      y,
      clientX,
      clientY,
      offsetLeft,
      offsetTop
    );

    const selectBox = container.querySelector<HTMLElement>(`.${SelectBoxCls}`);
    applyStyles(selectBox, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    });

    e.stopPropagation();
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isSelecting.current) return;
    isSelecting.current = false;

    const container = containerRef.current;
    if (!container) return;
    const { clientX, clientY } = e;
    const { x, y } = startState.current;
    const { offsetLeft, offsetTop } = container;

    const { left, top, width, height } = calculateSelectionBox(
      x,
      y,
      clientX,
      clientY,
      offsetLeft,
      offsetTop
    );

    const selectionA: Pos = [left, top];
    const selectionB: Pos = [left + width, top + height];

    nodes.forEach((node) => {
      if (!node || !node.el) return;

      const nodeA: Pos = [node.el.offsetLeft, node.el.offsetTop];
      const nodeB: Pos = [
        node.el.offsetLeft + node.el.clientWidth,
        node.el.offsetTop + node.el.clientHeight,
      ];

      if (isNodeInSelection(nodeA, nodeB, selectionA, selectionB)) {
        addNodeToSelected(node);
      } else {
        removeNodeFromSelected(node);
      }
    });

    container.querySelector(`.${SelectBoxCls}`)?.remove();
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      container?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerRef, nodes]);
};
