import './static/App.css';
import { MyChart } from "./components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <MyChart width={500} height={400} />
      </header>
    </div>
  );
}

export default App;
