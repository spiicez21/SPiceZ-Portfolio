import { lazy, Suspense } from 'react';
import './HeroBootSequence.css';

// Lazy load components
const TopographicBackground = lazy(() => import('../ui/TopographicBackground'));
const HeroPortrait = lazy(() => import('../ui/HeroPortrait'));
const TechnicalInfoBox = lazy(() => import('../ui/TechnicalInfoBox'));

const HeroBootSequence = () => {
    return (
        <div className="hero-boot-wrapper lando-style">
            <Suspense fallback={null}>
                <TopographicBackground />
            </Suspense>

            {/* Portrait - Centered */}
            <div className="hero-portrait-center">
                <Suspense fallback={null}>
                    <HeroPortrait />
                </Suspense>
            </div>

            {/* Bottom-Left Info Box */}
            <Suspense fallback={null}>
                <TechnicalInfoBox />
            </Suspense>

            <div className="hero-overlay-fade" />
        </div>
    );
};

export default HeroBootSequence;
