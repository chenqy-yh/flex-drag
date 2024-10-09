import { NodeMoveEvent } from "@/core/types";
import { useNodesStore } from "@/store";

const snapGap = 10;

const nodeSnap = (e: NodeMoveEvent) => {
  const { nodes } = useNodesStore();

  if (nodes.length < 2) return;

  const { node: tarNode, x, y } = e;
  if (!tarNode || !tarNode.el) return;
  const nx = x;
  const nx2 = x + tarNode.el.clientWidth;
  const ny = y;
  const ny2 = y + tarNode.el.clientHeight;

  let _minXGap = snapGap;
  let _minYGap = snapGap;
  nodes.forEach((node) => {
    if (!node || !node.el || node.el === tarNode.el) return;
    const fx = node.el.offsetLeft;
    const fx2 = fx + node.el.clientWidth;
    const fy = node.el.offsetTop;
    const fy2 = fy + node.el.clientHeight;

    _minXGap = Math.min(
      _minXGap,
      Math.abs(fx - nx),
      Math.abs(fx2 - nx2),
      Math.abs(fx2 - nx),
      Math.abs(fx - nx2)
    );
    _minYGap = Math.min(
      _minYGap,
      Math.abs(fy - ny),
      Math.abs(fy2 - ny2),
      Math.abs(fy2 - ny),
      Math.abs(fy - ny2)
    );
  });

  const delta = {
    dx: _minXGap < snapGap ? _minXGap : 0,
    dy: _minYGap < snapGap ? _minYGap : 0,
  };
  tarNode.setNodeState((state) => {
    return {
      ...state,
      x: state.x + delta.dx,
      y: state.y + delta.dy,
    };
  });
};

export const useSnap = () => {
  return { nodeSnap };
};
