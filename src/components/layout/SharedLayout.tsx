import type { ReactNode } from 'react';
import NavBar from './NavBar';
import SectionTransitions from '../utils/SectionTransitions';

interface SharedLayoutProps {
    children: ReactNode;
}

const SharedLayout = ({ children }: SharedLayoutProps) => {
    return (
        <div className="portfolio-page" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            <NavBar className="force-white-text" />
            <SectionTransitions />

            {/* Global Background Layer - Scrolling Gradient */}
            <div style={{
                position: 'absolute', // Changed to absolute so it scrolls with content
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                minHeight: '100vh',
                height: '100%',
                // Matches Portfolio.tsx gradient: Fades out completely by 30%
                background: 'linear-gradient(to bottom, #2a2d1f 0%, transparent 30%)',
            }} />

            <main style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </main>
        </div>
    );
};

export default SharedLayout;
