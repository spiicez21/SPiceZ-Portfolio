import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './routes/Portfolio';
import CMS from './routes/CMS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/cms" element={<CMS />} />
      </Routes>
    </Router>
  );
}

export default App
