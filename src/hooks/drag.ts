import { Node, NodeRef } from "@/core/types";
import { useSelectedNodeStore } from "@/store";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { minmax } from "@/utils/common";

type Position = {
  x: number;
  y: number;
};

type DragEvent = {
  nodes: NodeRef[];
};

type DragHandler = (e: DragEvent) => void;

type DragConfig = {
  targetRef: RefObject<HTMLDivElement>;
  parentRef: RefObject<HTMLDivElement>;
  setNodeState: React.Dispatch<React.SetStateAction<Node>>;
  onDragStart?: DragHandler;
  onDragEnd?: DragHandler;
};

export function useDraggable(config: DragConfig) {
  const { targetRef: elRef, parentRef } = config;

  const offset = useRef<Position[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { selectedNodes, addNodeToSelected, clearSelectedNodes } =
    useSelectedNodeStore();

  useEffect(() => {
    const element = elRef.current;
    const parent =
      parentRef?.current || element?.parentElement || document.body;

    if (!element || !parent) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);

      // const curIsSelected = checkIsSelected(element);
      // if (!curIsSelected) {
      //   clearSelectedNodes();
      //   addNodeToSelected({
      //     el: element,
      //     setNodeState: config.setNodeState,
      //   });
      // }

      offset.current = [];
      selectedNodes.forEach((nodeRef) => {
        if (!nodeRef.el) return;
        offset.current.push({
          x: e.clientX - parent.offsetLeft - nodeRef.el.offsetLeft,
          y: e.clientY - parent.offsetTop - nodeRef.el.offsetTop,
        });
      });
      console.log("drag down:", offset, selectedNodes);
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
        const { setNodeState } = nodeRef;
        setNodeState((state) => {
          if (!nodeRef.el) return state;
          const new_state = {
            ...state,
            x: `${minmax(
              clientX - offset.current[index].x - parent.offsetLeft,
              0,
              parent.offsetWidth - nodeRef.el.offsetWidth
            )}px`,
            y: `${minmax(
              clientY - offset.current[index].y - parent.offsetTop,
              0,
              parent.offsetHeight - nodeRef.el.offsetHeight
            )}px`,
          };

          return new_state;
        });
      });
      e.stopPropagation();
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
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
