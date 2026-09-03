import { useEffect, useRef, memo } from 'react';
import { contours } from 'd3-contour';

const TopographicBackground = ({ lineColor = '#000000' }: { lineColor?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const reduceMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const isMobile = window.innerWidth <= 768;
        // Grid resolution: coarser grid == quadratically less noise + contour work.
        const resolution = isMobile ? 40 : 28;
        // Contour bands: each band is a full marching-squares pass over the grid.
        const thresholds: number[] = [];
        for (let t = 0.1; t < 1; t += isMobile ? 0.1 : 0.06) thresholds.push(t);
        // Redraw budget. The visual is a slow drift, so 60fps buys nothing.
        const frameInterval = reduceMotion ? Infinity : isMobile ? 100 : 50;
        const animationSpeed = 0.00015;

        let cols = 0;
        let rows = 0;
        let cssWidth = 0;
        let cssHeight = 0;
        let values = new Float32Array(0);
        let rafId = 0;
        let lastDraw = 0;
        let visible = true;
        let running = false;
        const startTime = performance.now();
        let timeOffset = 0;

        class PerlinNoise {
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

        const getElevation = (x: number, y: number, time: number): number => {
            const scale = 0.002;
            let elevation = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

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

        // Colour string is parsed once instead of once per contour band.
        const isRgba = lineColor.includes('rgba');
        const baseOpacity = parseFloat(lineColor.match(/[\d.]+\)$/)?.[0] || '1');
        const strokeFor = (opacity: number) =>
            isRgba
                ? lineColor.replace(/[\d.]+\)$/, `${opacity})`)
                : lineColor.replace('rgb', 'rgba').replace(')', `, ${opacity})`);

        const measure = () => {
            // Size to the container, not the viewport. Most instances live inside
            // a card far smaller than the window.
            const rect = wrapper.getBoundingClientRect();
            const width = Math.max(1, Math.round(rect.width || window.innerWidth));
            const height = Math.max(1, Math.round(rect.height || window.innerHeight));
            if (width === cssWidth && height === cssHeight) return false;

            cssWidth = width;
            cssHeight = height;

            const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            // setTransform, not scale: scale() compounds across resizes.
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            cols = Math.max(2, Math.ceil(width / resolution));
            rows = Math.max(2, Math.ceil(height / resolution));
            if (values.length !== cols * rows) values = new Float32Array(cols * rows);
            return true;
        };

        const contourGenerator = () =>
            contours().size([cols, rows]).smooth(true).thresholds(thresholds);

        const draw = () => {
            // One pass fills the typed array directly - no intermediate 2D array,
            // no Array.from copy before handing it to d3-contour.
            for (let y = 0; y < rows; y++) {
                const py = y * resolution;
                const rowOffset = y * cols;
                for (let x = 0; x < cols; x++) {
                    values[rowOffset + x] = getElevation(x * resolution, py, timeOffset);
                }
            }

            ctx.clearRect(0, 0, cssWidth, cssHeight);

            const contourData = contourGenerator()(values as unknown as number[]);

            for (let index = 0; index < contourData.length; index++) {
                const contour = contourData[index];
                if (!contour.coordinates || contour.coordinates.length === 0) continue;

                const pulsePhase = (timeOffset * 0.0005 + index * 0.1) % (Math.PI * 2);
                const pulse = Math.sin(pulsePhase);
                ctx.strokeStyle = strokeFor(baseOpacity * (0.7 + pulse * 0.3));
                ctx.lineWidth = 0.8 + pulse * 0.3;

                // Batch every ring of a band into a single path -> one stroke call
                // per band instead of one per ring.
                ctx.beginPath();
                for (const polygon of contour.coordinates) {
                    for (const ring of polygon) {
                        for (let i = 0; i < ring.length; i++) {
                            const x = ring[i][0] * resolution;
                            const y = ring[i][1] * resolution;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                    }
                }
                ctx.stroke();
            }
        };

        const tick = (now: number) => {
            rafId = requestAnimationFrame(tick);
            if (now - lastDraw < frameInterval) return;
            lastDraw = now;
            timeOffset = now - startTime;
            draw();
        };

        const start = () => {
            if (running || reduceMotion) return;
            running = true;
            lastDraw = 0;
            rafId = requestAnimationFrame(tick);
        };

        const stop = () => {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
        };

        const sync = () => {
            if (visible && !document.hidden) start();
            else stop();
        };

        measure();
        draw();
        sync();

        // Stop burning frames while the section is scrolled out of view.
        let io: IntersectionObserver | undefined;
        if (typeof IntersectionObserver !== 'undefined') {
            io = new IntersectionObserver(
                (entries) => {
                    visible = entries.some((e) => e.isIntersecting);
                    sync();
                },
                { rootMargin: '100px' }
            );
            io.observe(wrapper);
        }

        const onVisibility = () => sync();
        document.addEventListener('visibilitychange', onVisibility);

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (measure()) draw();
            }, 200);
        };

        let ro: ResizeObserver | undefined;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(onResize);
            ro.observe(wrapper);
        } else {
            window.addEventListener('resize', onResize);
        }

        return () => {
            stop();
            clearTimeout(resizeTimeout);
            io?.disconnect();
            ro?.disconnect();
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [lineColor]);

    return (
        <div
            ref={wrapperRef}
            className="topographic-bg"
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                background: 'transparent',
                contain: 'layout paint style',
            }}
        >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
};

export default memo(TopographicBackground);
