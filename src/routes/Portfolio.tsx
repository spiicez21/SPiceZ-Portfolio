import { lazy, Suspense } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import WhoAmI from '../components/sections/WhoAmI';
import StackTrace from '../components/sections/StackTrace';

import VerifiedCredentials from '../components/sections/VerifiedCredentials';
import GitHubActivity from '../components/sections/GitHubActivity';
import OpenTicket from '../components/sections/OpenTicket';
import WorkNavigation from '../components/sections/WorkNavigation';

// Lazy load heavy components
const BossesDefeated = lazy(() => import('../components/sections/BossesDefeated'));

const Portfolio = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px' }}>
                <HeroBootSequence />
                <WhoAmI />
                <StackTrace />
                <WorkNavigation />
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
