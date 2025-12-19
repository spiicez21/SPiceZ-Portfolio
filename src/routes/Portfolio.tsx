import { lazy, Suspense } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import WhoAmI from '../components/sections/WhoAmI';

const VerifiedCredentials = lazy(() => import('../components/sections/VerifiedCredentials'));
const GitHubActivity = lazy(() => import('../components/sections/GitHubActivity'));
const OpenTicket = lazy(() => import('../components/sections/OpenTicket'));
const StackTrace = lazy(() => import('../components/sections/StackTrace'));
const WorkNavigation = lazy(() => import('../components/sections/WorkNavigation'));
const BossesDefeated = lazy(() => import('../components/sections/BossesDefeated'));

const Portfolio = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main>
                <HeroBootSequence />
                <WhoAmI />
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <StackTrace />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <WorkNavigation />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <VerifiedCredentials />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <BossesDefeated />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <GitHubActivity />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                    <OpenTicket />
                </Suspense>
            </main>
            <FooterBar />
        </div>
    );
};

export default Portfolio;
