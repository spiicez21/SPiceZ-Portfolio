import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, setWillChange, clearWillChange, shouldReduceMotion } from '../../lib/animations/gsapClient';

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
    threshold = 0.2,
    className = '',
    from,
    to
}: AnimateInProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const element = ref.current;
        if (!element) return;

        // Skip animations for users who prefer reduced motion
        if (shouldReduceMotion()) {
            gsap.set(element.children, { autoAlpha: 1 });
            return;
        }

        const defaultFrom: Record<string, gsap.TweenVars> = {
            'fade-up': { autoAlpha: 0, y: 20 },
            'fade-in': { autoAlpha: 0 },
            'slide-left': { autoAlpha: 0, x: -30 },
            'slide-right': { autoAlpha: 0, x: 30 },
            'scale-up': { autoAlpha: 0, scale: 0.95 },
            'blur-in': { autoAlpha: 0, filter: 'blur(2px)' },
            '3d-flip': { autoAlpha: 0, rotateX: 45, transformPerspective: 1000, transformOrigin: 'top center' },
            'clip-reveal': { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', autoAlpha: 0 },
            'blur-slide': { autoAlpha: 0, filter: 'blur(4px)', y: 30 },
        };

        const defaultTo: Record<string, gsap.TweenVars> = {
            'fade-up': {},
            'fade-in': {},
            'slide-left': {},
            'slide-right': {},
            'scale-up': {},
            'blur-in': { filter: 'blur(0px)' },
            '3d-flip': { autoAlpha: 1, rotateX: 0, ease: 'power2.out' },
            'clip-reveal': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', autoAlpha: 1, ease: 'power4.inOut' },
            'blur-slide': { autoAlpha: 1, filter: 'blur(0px)', y: 0, ease: 'power2.out' },
        };

        const baseTo: gsap.TweenVars = {
            autoAlpha: 1,
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
                start: `top ${100 - (threshold * 100)}%`,
                toggleActions: 'play none none none',
                onEnter: () => {
                    setWillChange(element.children, 'transform, opacity');
                },
                onLeave: () => {
                    clearWillChange(element.children);
                },
            }
        };

        const animationType = animation || 'fade-up';
        const fromVars = from || defaultFrom[animationType] || defaultFrom['fade-up'];
        const specificTo = defaultTo[animationType] || {};
        const toVars = { ...baseTo, ...specificTo, ...to };

        // Handle specific styles for 3D animations
        if (animationType === '3d-flip') {
            gsap.set(element.children, { transformStyle: 'preserve-3d' });
        }

        const tween = gsap.fromTo(element.children, fromVars, toVars);
        
        // Clear willChange after animation completes
        tween.eventCallback('onComplete', () => {
            clearWillChange(element.children);
        });

    }, { scope: ref, dependencies: [animation, delay, duration, stagger, threshold] });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default AnimateIn;
