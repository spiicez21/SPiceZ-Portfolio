import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BootLoader from './components/BootLoader';
import Portfolio from './routes/Portfolio';
const DeployedBuildsRoute = lazy(() => import('./routes/DeployedBuildsRoute'));
const PixelLabRoute = lazy(() => import('./routes/PixelLabRoute'));
const InProgressRoute = lazy(() => import('./routes/InProgressRoute'));

import { SmoothScrollProvider } from './context/SmoothScrollContext';
import RetroGrid from './components/utils/RetroGrid';
import CustomCursor from './components/ui/CustomCursor';

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
      <CustomCursor />
      {showBootLoader && <BootLoader onComplete={handleBootComplete} />}
      <Router>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/deployed-builds" element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
              <DeployedBuildsRoute />
            </Suspense>
          } />
          <Route path="/pixel-lab" element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
              <PixelLabRoute />
            </Suspense>
          } />
          <Route path="/in-progress" element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
              <InProgressRoute />
            </Suspense>
          } />
        </Routes>
      </Router>
    </SmoothScrollProvider>
  );
}

export default App
