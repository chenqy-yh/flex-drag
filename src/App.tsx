import FlexDrag from "./core/flex-drag";

function App() {
  const flexDrag = new FlexDrag({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  console.log(flexDrag);
  return <div>this is a test</div>;
}

export default App;
