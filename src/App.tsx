import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BootLoader from './components/BootLoader';
import Portfolio from './routes/Portfolio';
import CMS from './routes/CMS';

function App() {
  const [showBootLoader, setShowBootLoader] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('portfolio_visited');

    if (!hasVisited) {
      setShowBootLoader(true);
    }

    // Listen for boot sequence trigger
    const handleBootTrigger = () => {
      sessionStorage.removeItem('portfolio_visited');
      setShowBootLoader(true);
    };

    window.addEventListener('triggerBootSequence', handleBootTrigger);

    return () => {
      window.removeEventListener('triggerBootSequence', handleBootTrigger);
    };
  }, []);

  const handleBootComplete = () => {
    setShowBootLoader(false);
  };

  if (showBootLoader) {
    return <BootLoader onComplete={handleBootComplete} />;
  }

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
