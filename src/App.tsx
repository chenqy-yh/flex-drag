import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { FlexDrag } from "@/core";

function App() {
  const parRef = useRef<HTMLDivElement>(null);
  const [sonList, setSonList] = useState<
    {
      el: HTMLElement;
      flexDrag: FlexDrag;
    }[]
  >([]);

  const addFlexDrag = useCallback((key: number) => {
    const newDiv = document.createElement("div");
    newDiv.textContent = `son${key}`;
    newDiv.style.background = "#fefefe";
    newDiv.style.border = "1px solid black";

    parRef.current?.appendChild(newDiv);
    const flexDrag = new FlexDrag(newDiv, {
      x: "50%",
      y: "50%",
      width: "100px",
      height: "100px",
    });
    setSonList((prev) => {
      return [...prev, { el: newDiv, flexDrag }];
    });
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
          height: "100%",
        }}
      >
        <style>
          {`
        #par {
          width: 100%;
          height: 100%;
          background: #eeeeee;
        }
        #son {
          background: blue;
        }
      `}
        </style>
        <div id="par" ref={parRef}></div>
      </div>
    </div>
  );
}

export default App;
