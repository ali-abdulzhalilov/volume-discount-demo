import './static/App.css';
import {MyChart} from "./components";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <MyChart width={window.innerWidth-100} height={window.innerHeight-100}/>
            </header>
        </div>
    );
}

export default App;
