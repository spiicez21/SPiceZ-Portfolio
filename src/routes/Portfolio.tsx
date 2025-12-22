import { lazy, Suspense, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import WhoAmI from '../components/sections/WhoAmI';
import SectionTransitions from '../components/utils/SectionTransitions';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const VerifiedCredentials = lazy(() => import('../components/sections/VerifiedCredentials'));
const GitHubActivity = lazy(() => import('../components/sections/GitHubActivity'));
const OpenTicket = lazy(() => import('../components/sections/OpenTicket'));
const StackTrace = lazy(() => import('../components/sections/StackTrace'));
const WorkNavigation = lazy(() => import('../components/sections/WorkNavigation'));
const BossesDefeated = lazy(() => import('../components/sections/BossesDefeated'));

const Portfolio = () => {
    // Refresh ScrollTrigger on mount and resize to prevent section hiding
    useEffect(() => {
        const refreshScrollTrigger = () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        // Refresh after initial load
        refreshScrollTrigger();

        // Refresh on window resize
        window.addEventListener('resize', refreshScrollTrigger);

        return () => {
            window.removeEventListener('resize', refreshScrollTrigger);
        };
    }, []);

    return (
        <div className="portfolio-page">
            <NavBar />
            <SectionTransitions />
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
