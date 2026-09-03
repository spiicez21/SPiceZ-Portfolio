import { lazy, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import SectionTransitions from '../components/utils/SectionTransitions';
import LazyMount from '../components/utils/LazyMount';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { scheduleScrollTriggerRefresh } from '../lib/scrollRefresh';

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
        scheduleScrollTriggerRefresh();

        // Ignore the vertical-only resizes phones fire when the URL bar hides;
        // each one would otherwise trigger a full re-measure mid-scroll.
        let lastWidth = window.innerWidth;
        const handleResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            scheduleScrollTriggerRefresh(200);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
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

                <LazyMount>
                    <StackTrace />
                </LazyMount>
                <LazyMount>
                    <VerifiedCredentials />
                </LazyMount>
                <LazyMount>
                    <BossesDefeated />
                </LazyMount>
                <LazyMount minHeight="100vh">
                    <ProjectShowcase />
                </LazyMount>
                <LazyMount minHeight="50rem">
                    <CreativeShowcase />
                </LazyMount>
                <LazyMount>
                    <InProgressProcesses />
                </LazyMount>
                <LazyMount>
                    <GitHubActivity />
                </LazyMount>
                <LazyMount>
                    <OpenTicket />
                </LazyMount>
            </main>
            <FooterBar />
        </div>
    );
};

export default Portfolio;
