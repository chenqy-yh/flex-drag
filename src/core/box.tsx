import { useGuideLine, useSelectBox } from "@/hooks";
import { useRef } from "react";
import { FlexDragConfig } from "./types";
import FlexDragNode from "./node";

type FlexDragBoxProps = {
  width: number;
  height: number;
  nodes?: FlexDragConfig[];
};

const FlexDragBox: React.FC<FlexDragBoxProps> = (props) => {
  const { width, height, nodes: nodesConfig } = props;
  const boxRef = useRef<HTMLDivElement>(null);

  const { paintGuidLine } = useGuideLine({
    container: boxRef,
  });

  useSelectBox(boxRef);

  return (
    <div
      ref={boxRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid black",
        position: "relative",
      }}
    >
      {(nodesConfig || []).map((node, index) => {
        return (
          <FlexDragNode
            parentRef={boxRef}
            key={index}
            {...node}
            paint={paintGuidLine}
          />
        );
      })}
    </div>
  );
};

export default FlexDragBox;
