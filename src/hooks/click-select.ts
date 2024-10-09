import { Node } from "@/core/types";
import { useSelectedNodeStore } from "@/store/selected-node";
import { RefObject, useEffect } from "react";

type ClickSelectType = {
  targetRef: RefObject<HTMLDivElement>;
  setNodeState: React.Dispatch<React.SetStateAction<Node>>;
  capture?: boolean;
};

export const useClickSelect = (config: ClickSelectType) => {
  const { targetRef, setNodeState, capture } = config;
  const { clearSelectedNodes, addNodeToSelected } = useSelectedNodeStore();

  const handleMouseDown = (e: MouseEvent) => {
    if (!targetRef.current) return;
    clearSelectedNodes();
    addNodeToSelected({
      el: targetRef.current,
      setNodeState,
    });
  };

  useEffect(() => {
    targetRef.current?.addEventListener("mousedown", handleMouseDown, {
      capture: capture || false,
    });
    return () => {
      targetRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [targetRef.current]);
};
