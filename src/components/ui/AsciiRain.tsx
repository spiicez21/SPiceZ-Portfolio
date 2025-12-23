import { useEffect, useRef, useState } from 'react';

const AsciiRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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
        if (!canvas || !imageLoaded || !depthMapRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Container Size
        const parent = canvas.parentElement;
        let width = canvas.width = parent?.clientWidth || 300;
        let height = canvas.height = parent?.clientHeight || 400;

        // Create offscreen canvas to read pixel data proportional to container
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return;

        // Draw image to cover
        // Use 'cover' like object-fit logic
        const img = depthMapRef.current;
        // Zoom factor 1.5x to make the subject bigger
        const scale = Math.max(width / img.width, height / img.height) * 2;
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale + 100; // +40 to move down
        offCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Cache pixel data
        const imageData = offCtx.getImageData(0, 0, width, height);
        depthDataRef.current = imageData.data;

        // Matrix Config
        const fontSize = 10;
        const columns = Math.ceil(width / fontSize);
        const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);
        const chars = "YUGABHARATHIJAI21";

        // Scanline Config
        let scanY = 0;

        const draw = () => {
            // Trail effect (fade to transparent)
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';

            ctx.font = `${fontSize}px var(--font-mono)`;

            // Update Scanline
            scanY += 4; // Faster scan speed
            if (scanY > height) scanY = 0;

            for (let i = 0; i < drops.length; i++) {
                // Calculate position
                const posX = i * fontSize;
                const posY = Math.floor(drops[i] * fontSize);

                // Color Logic
                let val = 30; // Base dark grey for background/void

                if (depthDataRef.current && posY > 0 && posY < height && posX < width) {
                    const pixelIndex = (posY * width + posX) * 4;
                    const brightness = depthDataRef.current[pixelIndex];

                    // Map brightness (0-255) to a visible grey range (e.g., 30 - 255)
                    // The user wants darker grey on blacks, brighter white on whites
                    val = 30 + (brightness / 255) * 225;
                }

                // Scanline Effect
                const dist = Math.abs(posY - scanY);
                if (dist < 50) {
                    // Boost value near scanline for a shining effect
                    val += (1 - dist / 50) * 100;
                }

                // Clamp
                if (val > 255) val = 255;

                // Render
                ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;

                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, posX, posY);

                // Reset drop
                // > 0.85 makes it much more frequent (was 0.975)
                if (drops[i] * fontSize > height && Math.random() > 0.85) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 15);

        const handleResize = () => {
            width = canvas.width = parent?.clientWidth || 300;
            height = canvas.height = parent?.clientHeight || 400;

            // Re-cache depth data on resize
            offCanvas.width = width;
            offCanvas.height = height;
            // Recalculate cover
            const scale = Math.max(width / img.width, height / img.height) * 1.5;
            const x = (width / 2) - (img.width / 2) * scale;
            const y = (height / 2) - (img.height / 2) * scale + 40;
            offCtx?.drawImage(img, x, y, img.width * scale, img.height * scale);
            if (offCtx) depthDataRef.current = offCtx.getImageData(0, 0, width, height).data;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [imageLoaded]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
};

export default AsciiRain;
