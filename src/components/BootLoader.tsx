import { useEffect, useState, useRef } from 'react';
import { gsap } from '../lib/animations/gsapClient';
import './BootLoader.css';

interface LoadingState {
    stage: string;
    progress: number;
    status: 'loading' | 'complete' | 'error';
}

const bootMessages = [
    '> Calibrating neural networks...',
    '> Downloading more RAM...',
    '> Brewing coffee.exe...',
    '> Summoning async functions...',
    '> Git pulling creativity...',
    '> npm install hackathon-wins...',
    '> Compiling procrastination.css...',
    '> Initializing retro vibes...',
];

const stages = [
    { name: 'INITIALIZING SYSTEM...', progress: 20 },
    { name: 'LOADING DEPENDENCIES...', progress: 40 },
    { name: 'FETCHING ASSETS...', progress: 70 },
    { name: 'COMPILING UI COMPONENTS...', progress: 90 },
    { name: 'READY TO DEPLOY', progress: 100 },
];

interface BootLoaderProps {
    onComplete: () => void;
}

const BootLoader = ({ onComplete }: BootLoaderProps) => {
    const [loadingState, setLoadingState] = useState<LoadingState>({
        stage: stages[0].name,
        progress: 0,
        status: 'loading',
    });
    const [messages, setMessages] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const bootContentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Canvas Animation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions
        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // Grid configuration
        const fontSize = 14;
        const cols = Math.ceil(canvas.width / fontSize);
        const rows = Math.ceil(canvas.height / fontSize);
        const chars = '01';

        // Initialize cells
        const cells: { char: string; opacity: number; scale: number; x: number; y: number }[] = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                cells.push({
                    char: chars.charAt(Math.floor(Math.random() * chars.length)),
                    opacity: 0,
                    scale: 1,
                    x: i * fontSize,
                    y: j * fontSize
                });
            }
        }

        // Animation state
        let animationFrameId: number;
        const state = {
            globalAlpha: 1
        };

        // Render loop
        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            cells.forEach(cell => {
                if (cell.opacity <= 0.01) return;

                const x = cell.x + (fontSize / 2);
                const y = cell.y + (fontSize / 2);

                // Color matches var(--ink-muted) #888888 mostly
                ctx.fillStyle = `rgba(100, 100, 100, ${cell.opacity * state.globalAlpha})`;

                // Scale effect
                if (Math.abs(cell.scale - 1) > 0.01) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.scale(cell.scale, cell.scale);
                    ctx.fillText(cell.char, 0, 0);
                    ctx.restore();
                } else {
                    ctx.fillText(cell.char, x, y);
                }
            });

            if (state.globalAlpha > 0) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        // Expose animation triggers to the component logic
        (canvas as any).fadeInGrid = () => {
            gsap.to(cells, {
                opacity: 0.15,
                duration: 1,
                stagger: {
                    amount: 1,
                    from: "random"
                },
                ease: "power2.inOut"
            });
        };

        (canvas as any).dissolveGrid = (onCompleteCallback: () => void) => {
            const tl = gsap.timeline({
                onComplete: () => {
                    state.globalAlpha = 0; // Stop rendering
                    onCompleteCallback();
                }
            });

            // Scramble/Dissolve effect
            tl.to(cells, {
                opacity: 0,
                scale: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.5,
                    grid: [cols, rows],
                    from: "center"
                },
                ease: "power2.in"
            });
        };

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        // Define assets to preload
        const assetsToLoad = [
            '/Picture/Background-main.png',
            '/Picture/Main-Depth.png',
            '/Picture/doodle.png',
            '/Spotify-Badge/batbro.gif',
            // Add other critical assets here
        ];

        let loadedCount = 0;

        const updateProgress = () => {
            if (!isMounted) return;
            const progress = Math.min(Math.round((loadedCount / assetsToLoad.length) * 100), 100);

            // Map progress to stages
            let currentStageName = stages[0].name;
            if (progress > 20) currentStageName = stages[1].name;
            if (progress > 50) currentStageName = stages[2].name;
            if (progress > 80) currentStageName = stages[3].name;
            if (progress === 100) currentStageName = stages[4].name;

            setLoadingState({
                stage: currentStageName,
                progress: progress,
                status: progress === 100 ? 'complete' : 'loading'
            });

            if (progress === 100) {
                // FINISH SEQUENCE
                // Add a small delay for "READY TO DEPLOY" to be read
                setTimeout(() => {
                    if (!isMounted) return;
                    // START TRANSITION SEQUENCE
                    const canvas = canvasRef.current;
                    if (bootContentRef.current) {
                        gsap.to(bootContentRef.current, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.inOut",
                            onComplete: () => {
                                if (canvas) {
                                    (canvas as any).fadeInGrid();
                                    setTimeout(() => {
                                        if (containerRef.current) {
                                            gsap.to(containerRef.current, {
                                                backgroundColor: "var(--accent)",
                                                duration: 0.1,
                                                yoyo: true,
                                                repeat: 1,
                                                opacity: 0.8
                                            });
                                        }
                                        (canvas as any).dissolveGrid(() => {
                                            if (containerRef.current) {
                                                gsap.to(containerRef.current, {
                                                    opacity: 0,
                                                    duration: 0.2,
                                                    onComplete: () => {
                                                        onComplete();
                                                        sessionStorage.setItem('portfolio_visited', 'true');
                                                    }
                                                });
                                            }
                                        });
                                    }, 800);
                                }
                            }
                        });
                    }
                }, 500);
            }
        };

        // Preload Logic
        assetsToLoad.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                updateProgress();
            };
            img.onerror = () => {
                console.warn(`Failed to load asset: ${src}`);
                loadedCount++; // Count as loaded even on error to prevent hanging
                updateProgress();
            };
        });

        // Failsafe timeout (5 seconds max boot time)
        const failsafe = setTimeout(() => {
            if (loadedCount < assetsToLoad.length) {
                console.log("Bootloader timeout - forcing start");
                loadedCount = assetsToLoad.length;
                updateProgress();
            }
        }, 5000);

        // Message Rotator
        const messageInterval = setInterval(() => {
            const randomMessage = bootMessages[Math.floor(Math.random() * bootMessages.length)];
            setMessages(prev => [...prev.slice(-4), randomMessage]);
        }, 400);

        return () => {
            isMounted = false;
            clearTimeout(failsafe);
            clearInterval(messageInterval);
        };
    }, [onComplete]);

    const progressBarFill = `${loadingState.progress}%`;
    const progressChars = '█'.repeat(Math.floor(loadingState.progress / 10)) +
        '░'.repeat(10 - Math.floor(loadingState.progress / 10));

    return (
        <div ref={containerRef} className="boot-loader">
            <canvas ref={canvasRef} className="ascii-canvas" />

            <div ref={bootContentRef} className="boot-container">
                <div className="boot-header">
                    <div className="boot-title">INITIALIZING SPiceZ.PORTFOLIO v2.0.25</div>
                </div>

                <div className="boot-content">
                    <div className="boot-messages">
                        {messages.slice(-5).map((msg, idx) => (
                            <div key={idx} className="boot-message">
                                {msg}
                            </div>
                        ))}
                    </div>

                    <div className="boot-progress">
                        <div className="progress-label">
                            {'>'} Loading assets... [{progressChars}] {loadingState.progress}%
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: progressBarFill }}
                            />
                        </div>
                    </div>

                    <div className="boot-status">
                        STATUS: {loadingState.stage}
                    </div>
                </div>
            </div>

            <div className="scanline" />
        </div>
    );
};

export default BootLoader;
