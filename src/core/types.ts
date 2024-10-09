import { ReactNode, RefObject } from "react";

type ValueUnit = "px" | "%";

// export type StateUpdater<T> = T | ((data: T) => T) | (() => T);

export type Node = {
  x: string;
  y: string;
  width: string;
  height: string;
  data?: ReactNode;
};

export type NodeRef = {
  el: HTMLDivElement | null;
  setNodeState: React.Dispatch<React.SetStateAction<Node>>;
};

export type FlexDragConfig = Node & {
  boxRef?: React.RefObject<HTMLDivElement>;
  data?: ReactNode;
  dragable?: boolean;
};

export type FlexValue = {
  value: number;
  unit: ValueUnit;
};

export type NodeProps = Node & {
  parentRef: RefObject<HTMLDivElement>;
  paint: Function;
};

export type Position = {
  x: number;
  y: number;
};

export type NodeMoveEvent = {
  node: NodeRef;
} & Position;

export type ExposedRef = {
  targetRef: HTMLDivElement | null;
};
