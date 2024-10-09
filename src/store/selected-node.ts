import { NodeRef } from "@/core";
import { create } from "zustand";

type SelectedNodeStore = {
  selectedNodes: NodeRef[];
  getSeletedNodesRange: () => [number, number, number, number]; // x1 y1 x2 y2
  addNodeToSelected: (node: NodeRef) => void;
  removeNodeFromSelected: (node: NodeRef) => void;
  clearSelectedNodes: () => void;
};

export const useSelectedNodeStore = create<SelectedNodeStore>((set, get) => ({
  selectedNodes: [],
  getSeletedNodesRange: () => {
    const { selectedNodes } = get();
    if (selectedNodes.length === 0) return [0, 0, 0, 0];
    let x1 = Infinity,
      y1 = Infinity,
      x2 = -Infinity,
      y2 = -Infinity;

    selectedNodes.forEach((nodeRef) => {
      const { el } = nodeRef;
      if (!el) return;
      const { clientTop, clientLeft, offsetTop, offsetLeft } = el;
      x1 = Math.min(x1, clientLeft + offsetLeft);
      y1 = Math.min(y1, clientTop + offsetTop);
      x2 = Math.max(x2, clientLeft + offsetLeft + el.clientWidth);
      y2 = Math.max(y2, clientTop + offsetTop + el.clientHeight);
    });
    return [x1, y1, x2, y2];
  },
  addNodeToSelected: (node) => {
    set((state) => {
      const { selectedNodes } = state;
      const repeatIndex = selectedNodes.findIndex(
        (nodeRef) => nodeRef.el === node.el
      );
      if (repeatIndex !== -1) return state;
      return { selectedNodes: [...selectedNodes, node] };
    });
  },
  removeNodeFromSelected: (node) => {
    set((state) => {
      const { selectedNodes } = state;
      return { selectedNodes: selectedNodes.filter((n) => n.el !== node.el) };
    });
  },
  clearSelectedNodes: () => {
    set({ selectedNodes: [] });
  },
}));
