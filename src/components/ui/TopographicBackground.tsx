import { useEffect, useRef, memo } from 'react';
import { contours } from 'd3-contour';
import { range } from 'd3-array';

const TopographicBackground = ({ lineColor = '#000000' }: { lineColor?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let heightMap: number[][] = [];
        let animationFrameId: number;
        let timeOffset = 0;
        let startTime = Date.now();

        const isMobile = window.innerWidth <= 768;
        // Increase step size on mobile to reduce computation
        const step = isMobile ? 30 : 20;
        const resolution = step;
        const animationSpeed = 0.00015; // Control flow speed

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Limit canvas size for performance on high-DPI screens
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            generateHeightMap();
            animate();
        };

        class PerlinNoise {
            // ... (rest of the class remains same)
            private permutation: number[];

            constructor(seed = Math.random()) {
                this.permutation = [];
                for (let i = 0; i < 256; i++) {
                    this.permutation[i] = i;
                }
                for (let i = 255; i > 0; i--) {
                    const j = Math.floor((seed * 9999 + i) % (i + 1));
                    [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
                }
                this.permutation = [...this.permutation, ...this.permutation];
            }

            private fade(t: number): number {
                return t * t * t * (t * (t * 6 - 15) + 10);
            }

            private lerp(t: number, a: number, b: number): number {
                return a + t * (b - a);
            }

            private grad(hash: number, x: number, y: number): number {
                const h = hash & 3;
                const u = h < 2 ? x : y;
                const v = h < 2 ? y : x;
                return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
            }

            noise(x: number, y: number): number {
                const X = Math.floor(x) & 255;
                const Y = Math.floor(y) & 255;

                x -= Math.floor(x);
                y -= Math.floor(y);

                const u = this.fade(x);
                const v = this.fade(y);

                const a = this.permutation[X] + Y;
                const aa = this.permutation[a];
                const ab = this.permutation[a + 1];
                const b = this.permutation[X + 1] + Y;
                const ba = this.permutation[b];
                const bb = this.permutation[b + 1];

                return this.lerp(
                    v,
                    this.lerp(u, this.grad(this.permutation[aa], x, y), this.grad(this.permutation[ba], x - 1, y)),
                    this.lerp(u, this.grad(this.permutation[ab], x, y - 1), this.grad(this.permutation[bb], x - 1, y - 1))
                );
            }
        }

        const perlin = new PerlinNoise();

        const getElevation = (x: number, y: number, time: number = 0): number => {
            const scale = 0.002;
            let elevation = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

            // Create flowing wave effect with multiple directional movements
            const wave1 = Math.sin(time * 0.0008 + x * 0.001) * 30;
            const wave2 = Math.cos(time * 0.0006 + y * 0.0012) * 25;
            const wave3 = Math.sin(time * 0.0004 + (x + y) * 0.0008) * 20;

            const flowX = x + wave1 + wave3;
            const flowY = y + wave2 - wave3;

            for (let i = 0; i < 3; i++) {
                elevation += perlin.noise(
                    flowX * scale * frequency + time * animationSpeed,
                    flowY * scale * frequency + time * animationSpeed * 0.7
                ) * amplitude;
                maxValue += amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }

            return (elevation / maxValue + 1) / 2;
        };

        const generateHeightMap = () => {
            // Generate height map using optimized d3-contour compatible format
            const cols = Math.ceil(window.innerWidth / resolution);
            const rows = Math.ceil(window.innerHeight / resolution);

            heightMap = [];
            for (let y = 0; y <= rows; y++) {
                heightMap[y] = [];
                for (let x = 0; x <= cols; x++) {
                    heightMap[y][x] = getElevation(x * resolution, y * resolution, timeOffset);
                }
            }
        };

        const animate = () => {
            const currentTime = Date.now() - startTime;
            timeOffset = currentTime;
            
            generateHeightMap();
            drawContours();
            animationFrameId = requestAnimationFrame(animate);
        };

        const drawContours = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Convert heightMap to a flat array for d3-contour
            const cols = Math.ceil(width / resolution);
            const rows = Math.ceil(height / resolution);
            const values = new Float32Array(cols * rows);
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (heightMap[y] && heightMap[y][x] !== undefined) {
                        values[y * cols + x] = heightMap[y][x];
                    }
                }
            }

            // Generate contours using d3-contour
            const contourGenerator = contours()
                .size([cols, rows])
                .smooth(true)
                .thresholds(range(0.1, 1, 0.05));

            const contourData = contourGenerator(values);

            // Draw each contour with animated opacity
            contourData.forEach((contour, index) => {
                if (!contour.coordinates || contour.coordinates.length === 0) return;

                // Create pulsing opacity effect
                const pulsePhase = (timeOffset * 0.0005 + index * 0.1) % (Math.PI * 2);
                const opacityMultiplier = 0.7 + Math.sin(pulsePhase) * 0.3;
                
                // Parse the lineColor to add dynamic opacity
                const baseOpacity = parseFloat(lineColor.match(/[\d.]+\)$/)?.[0] || '1');
                const dynamicOpacity = baseOpacity * opacityMultiplier;
                
                ctx.strokeStyle = lineColor.includes('rgba') 
                    ? lineColor.replace(/[\d.]+\)$/, `${dynamicOpacity})`)
                    : lineColor.replace('rgb', 'rgba').replace(')', `, ${dynamicOpacity})`);
                
                ctx.lineWidth = 0.8 + Math.sin(pulsePhase) * 0.3;

                // Draw all MultiPolygon coordinates
                contour.coordinates.forEach((polygon) => {
                    polygon.forEach((ring) => {
                        ctx.beginPath();
                        ring.forEach((point, index) => {
                            // Scale coordinates from grid space to canvas space
                            const x = point[0] * resolution;
                            const y = point[1] * resolution;
                            
                            if (index === 0) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        });
                        ctx.closePath();
                        ctx.stroke();
                    });
                });
            });
        };

        resize();
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 200);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [lineColor]);

    return (
        <div className="topographic-bg" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            background: 'transparent'
        }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default memo(TopographicBackground);
