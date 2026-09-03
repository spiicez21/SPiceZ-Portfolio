import { useRef, useEffect, memo } from 'react';

interface RetroGridProps {
    className?: string;
    opacity?: number;
}

const RetroGrid = memo(({ className = '', opacity = 0.1 }: RetroGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // No mouse -> no parallax to compute, and no listener to install.
        const fine = window.matchMedia?.('(pointer: fine)').matches ?? true;
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        if (!fine || reduceMotion) return;

        let rafId = 0;
        let pendingX = 0;
        let pendingY = 0;

        const apply = () => {
            rafId = 0;
            grid.style.setProperty('--mouse-x', `${pendingX}px`);
            grid.style.setProperty('--mouse-y', `${pendingY}px`);
        };

        const handleMouseMove = (e: MouseEvent) => {
            pendingX = (e.clientX / window.innerWidth - 0.5) * 20;
            pendingY = (e.clientY / window.innerHeight - 0.5) * 20;
            // Coalesce to one style write per frame instead of cancelling and
            // re-scheduling a frame on every mousemove event.
            if (!rafId) rafId = requestAnimationFrame(apply);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            className={`retro-grid-wrapper fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ opacity, contain: 'layout paint style' }}
        >
            <div
                ref={gridRef}
                // 120vw/120vh instead of 200vw/200vh: the layer only needs enough
                // overhang to cover the perspective tilt and the 20px parallax.
                // At 200% the browser rasterises ~4x the pixels for no visual gain.
                className="retro-grid w-[120vw] h-[120vh] absolute top-[-10vh] left-[-10vw]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(var(--ink-accent-rgb), 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(var(--ink-accent-rgb), 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '2.5rem 2.5rem',
                    transform: 'perspective(500px) rotateX(20deg) translate3d(var(--mouse-x, 0), var(--mouse-y, 0), 0)',
                    willChange: 'transform',
                }}
            />
        </div>
    );
});

export default RetroGrid;
