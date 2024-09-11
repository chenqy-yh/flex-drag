import { useEffect, useRef } from "react";
import { useFlexDrag } from "@/hooks";

function App() {
  const sonRef = useRef<HTMLDivElement>(null);
  const parRef = useRef<HTMLDivElement>(null);

  useFlexDrag(sonRef, {
    x: "10%",
    y: "10%",
    width: "20%",
    height: "20%",
  });

  return (
    <div>
      f this is a test
      <style>
        {`
        #par {
          width: 200px;
          height: 200px;
          background: red;
        }
        #son {
          background: blue;
        }
      `}
      </style>
      <div id="par" ref={parRef}>
        <div id="son" ref={sonRef}>
          123
        </div>
      </div>
    </div>
  );
}

export default App;
