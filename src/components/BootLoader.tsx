import { useEffect, useState, useRef } from 'react';
import { gsap } from '../lib/animations/gsapClient';
import projectsData from '../content/projects.json';
import graphicsData from '../content/graphics.json';
import wipData from '../content/wip.json';
import certsData from '../content/certifications.json';
import TopographicBackground from './ui/TopographicBackground';
import './BootLoader.css';

interface BootLoaderProps {
    onComplete: () => void;
}

const BootLoader = ({ onComplete }: BootLoaderProps) => {
    const [imageProgress, setImageProgress] = useState(0);
    const [displayProgress, setDisplayProgress] = useState(0);
    const [svgData, setSvgData] = useState<{ d: string, fill: string }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadSvg = async () => {
            try {
                const response = await fetch('/brand/favicon.svg');
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'image/svg+xml');
                const paths = Array.from(doc.querySelectorAll('path')).map(p => ({
                    d: p.getAttribute('d') || '',
                    fill: p.getAttribute('fill') || 'var(--accent)'
                }));
                if (isMounted) setSvgData(paths);
            } catch (err) {
                console.error("Failed to load loader SVG:", err);
            }
        };

        loadSvg();

        // Only above-the-fold assets gate the loader. Previously all 41 content
        // images - most of them remote (Cloudinary, GitHub) and none visible on
        // the first screen - had to finish before the site was revealed, so the
        // loader lasted as long as the slowest third-party request.
        const criticalAssets = [
            '/images/portrait/yuga.webp',
            '/brand/favicon.svg'
        ];

        // Everything else is warmed in the background, after the reveal.
        const secondaryAssets = Array.from(new Set([
            ...projectsData.map(p => p.thumbnailPublicId),
            ...graphicsData.map(g => g.imagePublicId),
            ...wipData.map(w => w.imagePublicId),
            ...certsData.map(c => c.Badge),
            '/images/stickers/batbro.gif',
        ].filter((src): src is string => !!src && typeof src === 'string')));

        let loadedCount = 0;

        const updateImageProgress = () => {
            if (!isMounted) return;
            const newProgress = Math.min(Math.round((loadedCount / criticalAssets.length) * 100), 100);
            setImageProgress(newProgress);
        };

        criticalAssets.forEach(src => {
            const img = new Image();
            img.decoding = 'async';
            img.src = src;
            const done = () => { loadedCount++; updateImageProgress(); };
            img.onload = done;
            img.onerror = done;
        });

        // Hard ceiling on how long the loader can hold the page hostage.
        const failsafe = setTimeout(() => {
            if (loadedCount < criticalAssets.length) {
                loadedCount = criticalAssets.length;
                updateImageProgress();
            }
        }, 2500);

        // Prefetch the rest once the browser is idle, at low priority so it
        // never competes with the first paint or the hero animation.
        const warmSecondary = () => {
            if (!isMounted) return;
            secondaryAssets.forEach(src => {
                const img = new Image();
                img.decoding = 'async';
                (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'low';
                img.src = src;
            });
        };

        const hasIdle = typeof window.requestIdleCallback === 'function';
        const idleHandle = hasIdle
            ? window.requestIdleCallback(warmSecondary, { timeout: 4000 })
            : window.setTimeout(warmSecondary, 2000);

        return () => {
            isMounted = false;
            clearTimeout(failsafe);
            if (hasIdle) window.cancelIdleCallback(idleHandle);
            else clearTimeout(idleHandle);
        };
    }, []);

    // Combine progresses and finish
    useEffect(() => {
        const finalProgress = Math.round(imageProgress);
        setDisplayProgress(finalProgress);

        // We finish when images are effectively 100%
        if (imageProgress === 100) {
            const timer = setTimeout(() => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        onComplete();
                    }
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [imageProgress, onComplete]);

    // Initialize SVG paths once data is loaded
    useEffect(() => {
        if (svgData.length > 0) {
            pathRefs.current.forEach((path) => {
                if (path) {
                    const length = path.getTotalLength();
                    gsap.set(path, {
                        strokeDasharray: length,
                        strokeDashoffset: length,
                        fillOpacity: 0
                    });
                }
            });
        }
    }, [svgData]);

    // Animate all SVG paths based on progress
    useEffect(() => {
        pathRefs.current.forEach((path) => {
            if (path) {
                const length = path.getTotalLength();
                gsap.to(path, {
                    strokeDashoffset: length - (length * (displayProgress / 100)),
                    fillOpacity: displayProgress / 100,
                    duration: 0.3,
                    ease: "none", // Linear mapping for smooth progress
                    overwrite: "auto"
                });
            }
        });
    }, [displayProgress]);

    return (
        <div ref={containerRef} className="boot-loader minimalist">
            <TopographicBackground lineColor="rgb(var(--accent-rgb) / 0.08)" />
            <div className="loader-center-content">
                <svg
                    width="120"
                    height="186"
                    viewBox="0 0 75 116"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="loader-logo-svg"
                >
                    {svgData.map((path, i) => (
                        <path
                            key={i}
                            ref={el => { pathRefs.current[i] = el; }}
                            d={path.d}
                            stroke={path.fill === 'black' ? 'transparent' : 'var(--accent)'}
                            strokeWidth="1"
                            fill={path.fill === 'black' ? '#0a0a0a' : 'var(--accent)'}
                            fillOpacity="0"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
                <div className="loader-progress-text">{displayProgress}%</div>
            </div>
        </div>
    );
};

export default BootLoader;
