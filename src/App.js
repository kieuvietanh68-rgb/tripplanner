import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TripDetail from "./pages/TripDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:id" element={<TripDetail />} />
      </Routes>
    </Router>
  );
}

export default App;