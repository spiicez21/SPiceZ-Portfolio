import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

interface MagneticProps {
    children: React.ReactElement;
    strength?: number; // 1 = 1:1 movement, 0.5 = half, etc.
}

const Magnetic = ({ children, strength = 0.5 }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const element = ref.current;
        if (!element) return;

        const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        // We use state to trigger renders if needed, but quickTo is performant for refs
        // Actually, we can just bind events to the wrapper

        const mouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = element.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * strength);
            yTo(y * strength);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener("mousemove", mouseMove);
        element.addEventListener("mouseleave", mouseLeave);

        return () => {
            element.removeEventListener("mousemove", mouseMove);
            element.removeEventListener("mouseleave", mouseLeave);
        };
    }, { scope: ref });

    return (
        <div ref={ref} style={{ display: 'inline-block' }}>
            {children}
        </div>
    );
};

export default Magnetic;
