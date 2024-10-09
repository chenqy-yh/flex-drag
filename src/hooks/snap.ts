import { NodeMoveEvent, NodeRef } from "@/core/types";

const defaultSnapGap = 15;

export const nodeSnap = (e: NodeMoveEvent, nodes: NodeRef[], gap?: number) => {
  const { node: tarNode, x, y } = e;

  const snapGap = gap || defaultSnapGap;

  if (nodes.length < 2 || !tarNode || !tarNode.el) return { x, y };

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
  const nextPos = {
    x: nx + delta.dx,
    y: ny + delta.dy,
  };
  return nextPos;
};
