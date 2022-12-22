import "./App.scss";

import { data } from "./data/data";
import { Bubbles } from "./components/AxisBottom/Bubbles";

function App() {
  const filteredData: number[] = data.map((n) => Math.floor(n));

  return (
    <div className="Apple-tree">
      <div className="Apple-tree-garden">
        <Bubbles data={filteredData} width={764} height={573} />
      </div>
      <div className="Apple-tree-navigation"></div>
    </div>
  );
}

export default App;
