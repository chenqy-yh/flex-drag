import { NodeRef } from "@/core";
import { create } from "zustand";

type NodesStore = {
  nodes: NodeRef[];
  addNode: (node: NodeRef) => void;
  removeNode: (node: NodeRef) => void;
  clearNodes: () => void;
};

export const useNodesStore = create<NodesStore>((set, get) => ({
  nodes: [],
  addNode: (node) => {
    set((state) => {
      const { nodes } = state;
      const repeatIndex = nodes.findIndex((nodeRef) => nodeRef.el === node.el);
      if (repeatIndex !== -1) return state;
      return { nodes: [...nodes, node] };
    });
  },
  removeNode: (node) => {
    set((state) => {
      const { nodes } = state;
      return { nodes: nodes.filter((n) => n.el !== node.el) };
    });
  },
  clearNodes: () => {
    set({ nodes: [] });
  },
}));
