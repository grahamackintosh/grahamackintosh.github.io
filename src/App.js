import Home from './home/home.js'
import JsonPage from './json/json.js'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/json' element={<JsonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
