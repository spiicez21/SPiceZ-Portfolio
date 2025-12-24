import { useRef, useEffect } from 'react';
import { createNoise2D } from 'simplex-noise';

const TopoContours = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Initialize Noise
        const noise2D = createNoise2D();

        let width = container.clientWidth;
        let height = container.clientHeight;
        let animationFrameId: number;
        let offset = 0;

        const draw = () => {
            // Check Resize
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Config
            const scale = 0.005; // Zoom level of the map
            const levels = 8; // Number of topo layers

            // Optimization: Low-res render then scale up?
            // For now, pixel-by-pixel is okay for small areas, 
            // but let's use a smaller buffer for performance if needed.
            // Actually, drawing paths is better than pixels for smooth lines.

            // Pixel-based approach (Simpler for gradients)
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;

            // Move map slightly over time
            offset += 0.2;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // Generate noise value (-1 to 1)
                    let v = noise2D((x + offset) * scale, (y + offset * 0.5) * scale);

                    // Normalize to 0-1
                    v = (v + 1) / 2;

                    // Create sharp bands
                    // We want white lines at specific intervals
                    const band = 1 / levels;
                    const valInBand = v % band;

                    // Thickness of the line (in value space)
                    const thickness = 0.005;

                    if (valInBand < thickness) {
                        const index = (y * width + x) * 4;
                        // White line
                        data[index] = 255;
                        data[index + 1] = 255;
                        data[index + 2] = 255;
                        // Alpha based on height (higher = brighter/more opaque)
                        data[index + 3] = 50 + (v * 150);
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);

            // Optional: Draw scanline or noise grain on top?
            // Keep it clean for now.

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
        };

        window.addEventListener('resize', handleResize);
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} style={{ display: 'block', opacity: 0.6 }} />
        </div>
    );
};

export default TopoContours;
