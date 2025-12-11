import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimateInProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'blur-in';
    delay?: number;
    duration?: number;
    stagger?: number;
    threshold?: number;
    className?: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
}

const AnimateIn = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.6,
    stagger = 0,
    threshold = 0.2, // 20% visible
    className = '',
    from,
    to
}: AnimateInProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const element = ref.current;
        if (!element) return;

        const defaultFrom: Record<string, gsap.TweenVars> = {
            'fade-up': { opacity: 0, y: 30 },
            'fade-in': { opacity: 0 },
            'slide-left': { opacity: 0, x: -50 },
            'slide-right': { opacity: 0, x: 50 },
            'scale-up': { opacity: 0, scale: 0.9 },
            'blur-in': { opacity: 0, filter: 'blur(10px)' },
        };

        const defaultTo: gsap.TweenVars = {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: duration,
            delay: delay,
            stagger: stagger,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: `top ${100 - (threshold * 100)}%`, // e.g. "top 80%"
                toggleActions: 'play none none reverse',
            }
        };

        const fromVars = from || defaultFrom[animation] || defaultFrom['fade-up'];
        const toVars = { ...defaultTo, ...to };

        gsap.fromTo(element.children, fromVars, toVars);

    }, { scope: ref });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default AnimateIn;
