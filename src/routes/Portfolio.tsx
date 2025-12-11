import { lazy, Suspense } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import WhoAmI from '../components/sections/WhoAmI';
import StackTrace from '../components/sections/StackTrace';
import DeployedBuilds from '../components/sections/DeployedBuilds';
import InProgressProcesses from '../components/sections/InProgressProcesses';
import VerifiedCredentials from '../components/sections/VerifiedCredentials';
import GitHubActivity from '../components/sections/GitHubActivity';
import OpenTicket from '../components/sections/OpenTicket';

// Lazy load heavy components
const PixelLab = lazy(() => import('../components/sections/PixelLab'));
const BossesDefeated = lazy(() => import('../components/sections/BossesDefeated'));

const Portfolio = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px' }}>
                <HeroBootSequence />
                <WhoAmI />
                <StackTrace />
                <DeployedBuilds />
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <PixelLab />
                </Suspense>
                <InProgressProcesses />
                <VerifiedCredentials />
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <BossesDefeated />
                </Suspense>
                <GitHubActivity />
                <OpenTicket />
            </main>
            <FooterBar />
        </div>
    );
};

export default Portfolio;
