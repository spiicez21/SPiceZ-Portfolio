import { useEffect, useRef, useState } from 'react';

const AsciiRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const depthMapRef = useRef<HTMLImageElement | null>(null);
    const depthDataRef = useRef<Uint8ClampedArray | null>(null);

    // Load Depth Map
    useEffect(() => {
        const img = new Image();
        img.src = "/Picture/Main-Depth.png";
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            depthMapRef.current = img;
            setImageLoaded(true);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !imageLoaded || !depthMapRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Matrix Config
        // High density: lower font size
        const fontSize = 7;
        let columns = 0;
        let drops: number[] = [];
        const chars = "YUGABHARATHIJAI2101";

        const initDimensions = () => {
            width = container.clientWidth;
            height = container.clientHeight;

            // Handle DPI
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // CSS size
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Recalculate Matrix columns
            columns = Math.ceil(width / fontSize);
            drops = new Array(columns).fill(0).map(() => Math.random() * -100);

            // Update Depth Map Cache
            updateDepthCache(width, height);
        };

        const updateDepthCache = (w: number, h: number) => {
            const offCanvas = document.createElement('canvas');
            offCanvas.width = w;
            offCanvas.height = h;
            const offCtx = offCanvas.getContext('2d');
            if (!offCtx || !depthMapRef.current) return;

            const img = depthMapRef.current;
            // Cover logic
            const scale = Math.max(w / img.width, h / img.height) * 1.2;
            const x = (w / 2) - (img.width / 2) * scale;
            const y = (h / 2) - (img.height / 2) * scale;

            offCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
            depthDataRef.current = offCtx.getImageData(0, 0, w, h).data;
        };

        const draw = () => {
            // Fade effect - using very dark green/black
            ctx.fillStyle = 'rgba(0, 5, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

            for (let i = 0; i < drops.length; i++) {
                const posX = i * fontSize;
                const posY = Math.floor(drops[i] * fontSize);

                let color = 'rgba(178, 255, 5, 0.1)'; // Base subtle text

                // Depth Map Interaction
                if (depthDataRef.current && posY > 0 && posY < height && posX < width) {
                    const pixelIndex = (posY * width + posX) * 4;
                    if (pixelIndex < depthDataRef.current.length) {
                        const brightness = depthDataRef.current[pixelIndex];

                        // Map brightness to Neon Lime and White Contours
                        if (brightness > 20) {
                            const alpha = 0.2 + (brightness / 255) * 0.8;

                            // Topographic Contours (White Lines at specific depths)
                            // Create bands every 40 units of brightness
                            const isContour = (brightness % 40) < 4;

                            if (brightness > 245) {
                                // Specular Highlights (Closest points)
                                color = '#ffffff';
                            } else if (isContour && brightness > 50) {
                                // Depth Contours
                                color = `rgba(255, 255, 255, ${alpha + 0.2})`;
                            } else if (brightness > 220) {
                                // High points
                                color = '#b2ff05';
                            } else {
                                // Gradient
                                color = `rgba(178, 255, 5, ${alpha})`;
                            }
                        }
                    }
                }

                ctx.fillStyle = color;

                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, posX, posY);

                // Reset drop
                if (drops[i] * fontSize > height && Math.random() > 0.96) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        // Initialize and Start
        initDimensions();
        animationFrameId = requestAnimationFrame(draw);

        // Observer for Resize
        const resizeObserver = new ResizeObserver(() => {
            initDimensions();
        });
        resizeObserver.observe(container);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [imageLoaded]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
    );
};

export default AsciiRain;
