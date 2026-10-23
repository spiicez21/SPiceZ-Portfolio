import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './routes/Portfolio';
const DeployedBuildsRoute = lazy(() => import('./routes/DeployedBuildsRoute'));
const PixelLabRoute = lazy(() => import('./routes/PixelLabRoute'));
const InProgressRoute = lazy(() => import('./routes/InProgressRoute'));

import { SmoothScrollProvider } from './context/SmoothScrollContext';

function App() {
  return (
    <SmoothScrollProvider>
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
