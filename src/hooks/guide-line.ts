import { NodeMoveEvent } from "@/core/types";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { useNodesStore } from "@/store";

type GuideLineConfig = {
  container: RefObject<HTMLDivElement>;
};

export const useGuideLine = (config: GuideLineConfig) => {
  const { container } = config;

  const svgRef = useRef<SVGSVGElement | null>(null);

  const { nodes } = useNodesStore();

  const clearSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.replaceChildren();
  };

  const paintLine = (axis: "x" | "y", key: number) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", axis === "x" ? key.toString() : "0");
    line.setAttribute("y1", axis === "y" ? key.toString() : "0");
    line.setAttribute("x2", axis === "x" ? key.toString() : "100%");
    line.setAttribute("y2", axis === "y" ? key.toString() : "100%");
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "5,5");
    svgRef.current?.appendChild(line);
  };

  const paintGuidLine = () => {
    if (nodes.length < 2) return;
    clearSvg();
    const x_map: Record<number, number[]> = {};
    const y_map: Record<number, number[]> = {};
    nodes.forEach((node) => {
      if (!node || !node.el) return;
      const fx = node.el.offsetLeft;
      const fx2 = fx + node.el.clientWidth;
      const fy = node.el.offsetTop;
      const fy2 = fy + node.el.clientHeight;

      Array.isArray(x_map[fx]) ? x_map[fx].push(fy) : (x_map[fx] = [fy]);
      Array.isArray(x_map[fx2]) ? x_map[fx2].push(fy) : (x_map[fx2] = [fy]);
      Array.isArray(y_map[fy]) ? y_map[fy].push(fx) : (y_map[fy] = [fx]);
      Array.isArray(y_map[fy2]) ? y_map[fy2].push(fx) : (y_map[fy2] = [fx]);
    });

    // 遍历x_map
    for (const key in x_map) {
      const values = x_map[key];
      if (values.length < 2) continue;
      paintLine("x", parseInt(key));
    }

    for (const key in y_map) {
      const values = y_map[key];
      if (values.length < 2) continue;
      paintLine("y", parseInt(key));
    }
  };

  useEffect(() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    container.current?.appendChild(svg);
    svgRef.current = svg;
  }, [container.current]);

  return { paintGuidLine };
};
