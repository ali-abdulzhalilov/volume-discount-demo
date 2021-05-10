import './static/App.css';
import { MyChart } from "./components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <MyChart width={600} height={300} />
      </header>
    </div>
  );
}

export default App;
