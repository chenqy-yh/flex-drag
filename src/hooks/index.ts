import { FlexDrag, FlexDragConfig } from "@/core";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";

// custom hook
export const useFlexDrag = (
  ref: RefObject<HTMLElement>,
  config: FlexDragConfig
) => {
  const flexDragRef = useRef<FlexDrag | null>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("ref.current", ref.current);
      flexDragRef.current = new FlexDrag(ref.current, config);
    }
    return () => {
      flexDragRef.current?.destory();
    };
  }, [ref, config]);
};
