import { Node, NodeMoveEvent, NodeRef } from "@/core/types";
import { useNodesStore, useSelectedNodeStore } from "@/store";
import { minmax } from "@/utils/common";
import { RefObject, useEffect, useRef, useState } from "react";
import { nodeSnap } from "./snap";

type Position = {
  x: number;
  y: number;
};

type DragHandler = (e: NodeMoveEvent) => void;

type DragConfig = {
  targetRef: RefObject<HTMLDivElement>;
  parentRef: RefObject<HTMLDivElement>;
  snap?: boolean | { value: number };
  setNodeState: React.Dispatch<React.SetStateAction<Node>>;
  onDragStart?: DragHandler;
  onDragEnd?: DragHandler;
};

const formatOpts = (opts: DragConfig) => {
  if (typeof opts.snap === "undefined") {
    opts.snap = true;
  }
  return opts;
};

export function useDraggable(config: DragConfig) {
  const {
    targetRef: elRef,
    parentRef,
    snap,
    onDragStart,
    onDragEnd,
  } = formatOpts(config);

  const offset = useRef<Position[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { nodes } = useNodesStore();

  const { selectedNodes } = useSelectedNodeStore();

  useEffect(() => {
    const element = elRef.current;
    const parent =
      parentRef?.current || element?.parentElement || document.body;

    if (!element || !parent) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);

      offset.current = [];
      selectedNodes.forEach((nodeRef) => {
        if (!nodeRef.el) return;
        offset.current.push({
          x: e.clientX - parent.offsetLeft - nodeRef.el.offsetLeft,
          y: e.clientY - parent.offsetTop - nodeRef.el.offsetTop,
        });
      });
      e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const { clientX, clientY } = e;

      let gpLeft = Infinity,
        gpTop = Infinity,
        gpW = 0,
        gpH = 0;

      selectedNodes.forEach((nodeRef) => {
        const { el } = nodeRef;
        if (!el) return;
        gpLeft = Math.min(gpLeft, el.offsetLeft);
        gpTop = Math.min(gpTop, el.offsetTop);
        gpW = Math.max(gpW, gpLeft - el.offsetLeft + el.offsetWidth);
        gpH = Math.max(gpH, gpTop - el.offsetTop + el.offsetHeight);
      });

      if (
        gpLeft === Infinity ||
        gpTop === Infinity ||
        gpLeft < 0 ||
        gpLeft + gpW > parent.offsetWidth ||
        gpTop < 0 ||
        gpTop + gpH > parent.offsetHeight
      )
        return;

      selectedNodes.forEach((nodeRef, index) => {
        const { el } = nodeRef;
        if (!el) return;
        const x = minmax(
          clientX - offset.current[index].x - parent.offsetLeft,
          0,
          parent.offsetWidth - el.offsetWidth
        );
        const y = minmax(
          clientY - offset.current[index].y - parent.offsetTop,
          0,
          parent.offsetHeight - el.offsetHeight
        );
        moveNode(nodeRef, x, y);
      });
      e.stopPropagation();
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
    };

    const moveNode = (nodeRef: NodeRef, x: number, y: number) => {
      const { setNodeState } = nodeRef;
      const moveEvt = { node: nodeRef, x, y };
      onDragStart && onDragStart(moveEvt);
      // snap
      const snapValue = typeof snap === "object" ? snap.value : undefined;
      const nodeSnapResult = snap
        ? nodeSnap(moveEvt, nodes, snapValue)
        : { x, y };
      const { x: fx, y: fy } = nodeSnapResult;
      setNodeState((state) => {
        return {
          ...state,
          x: fx,
          y: fy,
        };
      });
      onDragEnd && onDragEnd(moveEvt);
    };

    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [elRef, selectedNodes, parentRef, isDragging, offset]);
}
