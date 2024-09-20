import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamepadMapping from './pages/GamepadMapping';
import ControlPanel from './pages/ControlPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamepadMapping />} />
        <Route path="/control-panel" element={<ControlPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
