import { useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';
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
    const { progress: threeProgress, active: threeActive } = useProgress();
    const [displayProgress, setDisplayProgress] = useState(0);
    const [svgData, setSvgData] = useState<{ d: string, fill: string }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadSvg = async () => {
            try {
                const response = await fetch('/Favicon/favicon.svg');
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'image/svg+xml');
                const paths = Array.from(doc.querySelectorAll('path')).map(p => ({
                    d: p.getAttribute('d') || '',
                    fill: p.getAttribute('fill') || '#b2ff05'
                }));
                if (isMounted) setSvgData(paths);
            } catch (err) {
                console.error("Failed to load loader SVG:", err);
            }
        };

        loadSvg();

        // Aggregate all images from JSON data
        const contentImages = [
            ...projectsData.map(p => p.thumbnailPublicId),
            ...graphicsData.map(g => g.imagePublicId),
            ...wipData.map(w => w.imagePublicId),
            ...certsData.map(c => c.Badge)
        ].filter(src => src && typeof src === 'string');

        const criticalAssets = [
            '/Picture/normal-main.png',
            '/Favicon/favicon.svg'
        ];

        const secondaryAssets = [
            ...contentImages,
            '/Spotify-Badge/batbro.gif',
            '/LH44/LH-helment.png',
            '/LH44/w11-car.png',
        ];

        const assetsToLoad = Array.from(new Set([...criticalAssets, ...secondaryAssets]));

        let loadedCount = 0;

        const updateImageProgress = () => {
            if (!isMounted) return;
            const newProgress = Math.min(Math.round((loadedCount / assetsToLoad.length) * 100), 100);
            setImageProgress(newProgress);
        };

        assetsToLoad.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => { loadedCount++; updateImageProgress(); };
            img.onerror = () => { loadedCount++; updateImageProgress(); };
        });

        const failsafe = setTimeout(() => {
            if (loadedCount < assetsToLoad.length) {
                loadedCount = assetsToLoad.length;
                updateImageProgress();
            }
        }, 15000);

        return () => {
            isMounted = false;
            clearTimeout(failsafe);
        };
    }, []);

    // Combine progresses and finish
    useEffect(() => {
        // If Three.js is not active and progress is 0, it might not have started or nothing to load
        // If it's 100, it's finished.
        const effectiveThreeProgress = (!threeActive && threeProgress === 0) ? 100 : threeProgress;

        const totalProgress = (imageProgress + effectiveThreeProgress) / 2;
        const finalProgress = Math.round(totalProgress);

        setDisplayProgress(finalProgress);

        // We finish when both are effectively 100% and three is no longer active
        if (imageProgress === 100 && (threeProgress === 100 || !threeActive)) {
            const timer = setTimeout(() => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        onComplete();
                    }
                });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [imageProgress, threeProgress, threeActive, onComplete]);

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
                    duration: 0.4,
                    ease: "power1.out"
                });

                // Also fade in the fill as it draws
                gsap.to(path, {
                    fillOpacity: displayProgress / 100,
                    duration: 0.6
                });
            }
        });
    }, [displayProgress]);

    return (
        <div ref={containerRef} className="boot-loader minimalist">
            <TopographicBackground lineColor="rgba(178, 255, 5, 0.08)" />
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
                            stroke={path.fill === 'black' ? 'transparent' : '#b2ff05'}
                            strokeWidth="1"
                            fill={path.fill === 'black' ? '#0a0a0a' : '#b2ff05'}
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
