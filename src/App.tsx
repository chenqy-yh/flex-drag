import { FlexDragConfig, Box } from "@/core";
import { useCallback, useState } from "react";

function App() {
  const [sonList, setSonList] = useState<FlexDragConfig[]>([]);

  const addFlexDrag = useCallback((key: number) => {
    const node: FlexDragConfig = {
      x: 10,
      y: 10,
      width: "max-content",
      height: "max-content",
      data: `node ${key}`,
    };
    setSonList((prev) => [...prev, node]);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button onClick={() => addFlexDrag(sonList.length)}>add</button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box width={1000} height={500} nodes={sonList} />
      </div>
    </div>
  );
}

export default App;
