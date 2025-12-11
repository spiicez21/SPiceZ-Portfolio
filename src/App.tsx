import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BootLoader from './components/BootLoader';
import Portfolio from './routes/Portfolio';

import { SmoothScrollProvider } from './context/SmoothScrollContext';
import RetroGrid from './components/utils/RetroGrid';
import SpotifyEasterEgg from './components/ui/SpotifyEasterEgg';

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

  return (
    <SmoothScrollProvider>
      <RetroGrid opacity={0.05} />
      {showBootLoader && <BootLoader onComplete={handleBootComplete} />}
      <Router>
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </Router>
      <SpotifyEasterEgg />
    </SmoothScrollProvider>
  );
}

export default App
