import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimateInProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'blur-in' | '3d-flip' | 'clip-reveal' | 'blur-slide';
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
            '3d-flip': { opacity: 0, rotateX: 90, transformPerspective: 1000, transformOrigin: 'top center' },
            'clip-reveal': { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', opacity: 0 },
            'blur-slide': { opacity: 0, filter: 'blur(20px)', y: 50 },
        };

        const defaultTo: Record<string, gsap.TweenVars> = {
            'fade-up': {}, // uses defaults
            'fade-in': {},
            'slide-left': {},
            'slide-right': {},
            'scale-up': {},
            'blur-in': { filter: 'blur(0px)' },
            '3d-flip': { opacity: 1, rotateX: 0, ease: 'power2.out' }, // transformPerspective persists
            'clip-reveal': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1, ease: 'power4.inOut' },
            'blur-slide': { opacity: 1, filter: 'blur(0px)', y: 0, ease: 'power2.out' },
        };

        const baseTo: gsap.TweenVars = {
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
                toggleActions: 'play none none none',
            }
        };

        const animationType = animation || 'fade-up';
        const fromVars = from || defaultFrom[animationType] || defaultFrom['fade-up'];
        const specificTo = defaultTo[animationType] || {};
        const toVars = { ...baseTo, ...specificTo, ...to };

        // Handle specific styles needed for 3D/Clip
        if (animationType === '3d-flip') {
            gsap.set(element.children, { transformStyle: 'preserve-3d' });
        }

        gsap.fromTo(element.children, fromVars, toVars);

    }, { scope: ref });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default AnimateIn;
