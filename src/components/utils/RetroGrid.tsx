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

        let rafId: number;
        const handleMouseMove = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                grid.style.setProperty('--mouse-x', `${x}px`);
                grid.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            className={`retro-grid-wrapper fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ opacity: opacity, willChange: 'transform' }}
        >
            <div
                ref={gridRef}
                className="retro-grid w-[200vw] h-[200vh] absolute top-[-50vh] left-[-50vw]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(var(--ink-accent-rgb), 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(var(--ink-accent-rgb), 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(20deg) translate(var(--mouse-x, 0), var(--mouse-y, 0))',
                } as any}
            />
        </div>
    );
});

export default RetroGrid;
