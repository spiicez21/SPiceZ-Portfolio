import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface RetroGridProps {
    className?: string;
    opacity?: number;
}

const RetroGrid = ({ className = '', opacity = 0.1 }: RetroGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to(grid, {
                x: x,
                y: y,
                duration: 1,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className={`retro-grid-wrapper fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ opacity: opacity }}
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
};

export default RetroGrid;
