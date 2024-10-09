import { useDraggable, useRegister } from "@/hooks";
import { useSelectedNodeStore } from "@/store";
import { useMemo } from "react";
import type { NodeMoveEvent, NodeProps } from "./types";

const FlexDragNode: React.FC<NodeProps> = (props) => {
  const { x, y, width, height, data, parentRef, paint } = props;

  const { targetRef, nodeState, setNodeState } = useRegister({
    x,
    y,
    width,
    height,
  });

  const { selectedNodes, clearSelectedNodes, addNodeToSelected } =
    useSelectedNodeStore();

  const isSeleted = useMemo(() => {
    return selectedNodes.some((node) => node.el === targetRef.current);
  }, [selectedNodes]);


  const onDragEnd = (e: NodeMoveEvent) => {
    paint();
  };


  useDraggable({
    targetRef,
    parentRef,
    setNodeState: setNodeState,
    onDragEnd: onDragEnd,
  });

  const handleMouseDown = () => {
    if (!isSeleted) {
      clearSelectedNodes();
      addNodeToSelected({
        el: targetRef.current,
        setNodeState,
      });
    }
  };

  return (
    <div
      ref={targetRef}
      style={{
        left: nodeState.x,
        top: nodeState.y,
        width: nodeState.width,
        height: nodeState.height,
        position: "absolute",
        cursor: "pointer",
        padding: "20px",
        background: "#eee",
        border: "1px solid black",
        boxSizing: "border-box",
        userSelect: "none",
      }}
      onMouseDownCapture={handleMouseDown}
    >
      {data} - {isSeleted ? "selected" : "unselected"}
    </div>
  );
};

export default FlexDragNode;
