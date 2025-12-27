import { useRef, useEffect, memo } from 'react';
import { gsap } from 'gsap';

interface RetroGridProps {
    className?: string;
    opacity?: number;
}

const RetroGrid = memo(({ className = '', opacity = 0.1 }: RetroGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // Initialize quickTo for performance
        const xTo = gsap.quickTo(grid, "x", { duration: 1, ease: "power2.out" });
        const yTo = gsap.quickTo(grid, "y", { duration: 1, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
            // Check if frame is available to throttle? useGSAP does this internally usually but here we are using vanilla listener
            // Using requestAnimationFrame might be better, but quickTo handles interpolation well.
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            xTo(x);
            yTo(y);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
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
                    transform: 'perspective(500px) rotateX(20deg)', // Slight 3D tilt if desired, or flat
                }}
            />
        </div>
    );
});

export default RetroGrid;
