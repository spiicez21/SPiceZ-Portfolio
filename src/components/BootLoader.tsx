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
    const [progress, setProgress] = useState(0);
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

        const localAssets = [
            '/Picture/normal-main.png',
            '/Picture/Main-Depth.png',
            '/Spotify-Badge/batbro.gif',
            '/LH44/LH-helment.png',
            '/LH44/w11-car.png',
            '/Favicon/favicon.svg'
        ];

        const assetsToLoad = Array.from(new Set([...contentImages, ...localAssets]));

        let loadedCount = 0;

        const updateProgress = () => {
            if (!isMounted) return;
            const newProgress = Math.min(Math.round((loadedCount / assetsToLoad.length) * 100), 100);
            setProgress(newProgress);

            if (newProgress === 100) {
                setTimeout(() => {
                    if (!isMounted) return;
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: () => {
                            onComplete();
                            sessionStorage.setItem('portfolio_visited', 'true');
                        }
                    });
                }, 800);
            }
        };

        assetsToLoad.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => { loadedCount++; updateProgress(); };
            img.onerror = () => { loadedCount++; updateProgress(); };
        });

        const failsafe = setTimeout(() => {
            if (loadedCount < assetsToLoad.length) {
                loadedCount = assetsToLoad.length;
                updateProgress();
            }
        }, 15000); // Increased timeout for many images

        return () => {
            isMounted = false;
            clearTimeout(failsafe);
        };
    }, [onComplete]);

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
                    strokeDashoffset: length - (length * (progress / 100)),
                    duration: 0.4,
                    ease: "power1.out"
                });

                // Also fade in the fill as it draws
                gsap.to(path, {
                    fillOpacity: progress / 100,
                    duration: 0.6
                });
            }
        });
    }, [progress]);

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
                <div className="loader-progress-text">{progress}%</div>
            </div>
        </div>
    );
};

export default BootLoader;
