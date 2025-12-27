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
            if (canvas.width !== width / 4 || canvas.height !== height / 4) {
                canvas.width = width / 4;
                canvas.height = height / 4;
            }

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Config
            const scale = 0.005; // Zoom level of the map
            // Wait, if we iterate fewer pixels, we need to cover the same "spatial" area.
            // visual area = width * scale.
            // new width = width / 4. 
            // So to cover same noise area, spatial step must skip 4x? 
            // Actually simpler: just input (x*4) into noise.

            const levels = 8;

            const imgData = ctx.createImageData(canvas.width, canvas.height);
            const data = imgData.data;

            // Move map slightly over time
            offset += 0.2;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    // Generate noise value
                    // Multiply coords by 4 to sample the original "resolution" of noise

                    let v = noise2D((x * 4 + offset) * scale, (y * 4 + offset * 0.5) * scale);

                    v = (v + 1) / 2;

                    // Sharp bands
                    const band = 1 / levels;
                    const valInBand = v % band;
                    const thickness = 0.005;

                    if (valInBand < thickness) {
                        const index = (y * canvas.width + x) * 4;
                        data[index] = 255;
                        data[index + 1] = 255;
                        data[index + 2] = 255;
                        data[index + 3] = 50 + (v * 150);
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);
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
            {/* CSS scales it back up with pixelation for retro look, or blur for smooth */}
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    opacity: 0.6,
                    width: '100%',
                    height: '100%',
                    imageRendering: 'pixelated' /* Retro style */
                }}
            />
        </div>
    );
};

export default TopoContours;
