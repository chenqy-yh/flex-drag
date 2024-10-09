import { Node } from "@/core/types";
import { useNodesStore } from "@/store";
import { useEffect, useRef, useState } from "react";

export const useRegister = (node: Node) => {
  const { x, y, width, height } = node;

  const targetRef = useRef<HTMLDivElement>(null);
  const [nodeState, setNodeState] = useState<Node>({
    x: x,
    y: y,
    width: width,
    height: height,
  });
  const { addNode, removeNode } = useNodesStore();
  useEffect(() => {
    if (!targetRef.current) return;
    addNode({
      el: targetRef.current,
      setNodeState,
    });
    return () => {
      removeNode({
        el: targetRef.current,
        setNodeState,
      });
    };
  }, [targetRef.current]);
  return {
    targetRef,
    nodeState,
    setNodeState,
  };
};
