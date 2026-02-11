import { lazy, Suspense, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import SectionTransitions from '../components/utils/SectionTransitions';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';



gsap.registerPlugin(ScrollTrigger);

const VerifiedCredentials = lazy(() => import('../components/sections/VerifiedCredentials'));
const GitHubActivity = lazy(() => import('../components/sections/GitHubActivity'));
const OpenTicket = lazy(() => import('../components/sections/OpenTicket'));
const StackTrace = lazy(() => import('../components/sections/StackTrace'));
const BossesDefeated = lazy(() => import('../components/sections/BossesDefeated'));
const ProjectShowcase = lazy(() => import('../components/sections/ProjectShowcase'));
const CreativeShowcase = lazy(() => import('../components/sections/CreativeShowcase'));
const InProgressProcesses = lazy(() => import('../components/sections/InProgressProcesses'));

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
        <div className="portfolio-page" style={{ position: 'relative', minHeight: '100vh' }}>
            <NavBar />
            <SectionTransitions />

            {/* Global Background Layer - Scrolling Gradient */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                minHeight: '100vh',
                height: '100%',
                // Solid Dark Olive (Start) -> Covers sections -> Transparent (Open Ticket)
                background: 'linear-gradient(to bottom, #2a2d1f 0%, #2a2d1f 60%, transparent 100%)',
            }} />

            <main style={{ position: 'relative', zIndex: 1 }}>
                <HeroBootSequence />

                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <StackTrace />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <VerifiedCredentials />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <BossesDefeated />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                    <ProjectShowcase />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '50rem' }} />}>
                    <CreativeShowcase />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <InProgressProcesses />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <GitHubActivity />
                </Suspense>
                <Suspense fallback={<div style={{ minHeight: '25rem' }} />}>
                    <OpenTicket />
                </Suspense>
            </main>
            <FooterBar />
        </div>
    );
};

export default Portfolio;
