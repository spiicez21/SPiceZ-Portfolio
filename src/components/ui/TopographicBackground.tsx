import { useEffect, useRef, memo } from 'react';

const TopographicBackground = ({ lineColor = '#000000' }: { lineColor?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let heightMap: number[][] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateHeightMap();
        };

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

        const getElevation = (x: number, y: number): number => {
            const scale = 0.002;
            let elevation = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

            for (let i = 0; i < 3; i++) {
                elevation += perlin.noise(
                    x * scale * frequency,
                    y * scale * frequency
                ) * amplitude;
                maxValue += amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }

            return (elevation / maxValue + 1) / 2;
        };

        const generateHeightMap = () => {
            const resolution = 20;
            const cols = Math.ceil(canvas.width / resolution);
            const rows = Math.ceil(canvas.height / resolution);

            heightMap = [];
            for (let y = 0; y <= rows; y++) {
                heightMap[y] = [];
                for (let x = 0; x <= cols; x++) {
                    heightMap[y][x] = getElevation(x * resolution, y * resolution);
                }
            }
        };

        const getHeight = (x: number, y: number): number => {
            const resolution = 20;
            const col = x / resolution;
            const row = y / resolution;

            if (row < 0 || row >= heightMap.length - 1 || col < 0 || !heightMap[Math.floor(row)] || col >= heightMap[0].length - 1) {
                return 0;
            }

            const x0 = Math.floor(col);
            const y0 = Math.floor(row);
            const x1 = x0 + 1;
            const y1 = y0 + 1;

            const fx = col - x0;
            const fy = row - y0;

            const h00 = heightMap[y0][x0];
            const h10 = heightMap[y0][x1];
            const h01 = heightMap[y1][x0];
            const h11 = heightMap[y1][x1];

            const h0 = h00 * (1 - fx) + h10 * fx;
            const h1 = h01 * (1 - fx) + h11 * fx;

            return h0 * (1 - fy) + h1 * fy;
        };

        const drawContours = () => {
            const contourInterval = 0.05;
            const numContours = Math.floor(1 / contourInterval);

            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = lineColor;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing

            for (let i = 0; i <= numContours; i++) {
                const elevation = i * contourInterval;

                const marchingSquares = (elev: number) => {
                    const step = 20;

                    for (let y = 0; y < canvas.height - step; y += step) {
                        for (let x = 0; x < canvas.width - step; x += step) {
                            const tl = getHeight(x, y) > elev ? 1 : 0;
                            const tr = getHeight(x + step, y) > elev ? 1 : 0;
                            const br = getHeight(x + step, y + step) > elev ? 1 : 0;
                            const bl = getHeight(x, y + step) > elev ? 1 : 0;

                            const cellValue = tl * 8 + tr * 4 + br * 2 + bl * 1;

                            if (cellValue === 0 || cellValue === 15) continue;

                            const interpolate = (v1: number, v2: number, p1: [number, number], p2: [number, number]): [number, number] => {
                                const t = (elev - v1) / (v2 - v1);
                                return [
                                    p1[0] + t * (p2[0] - p1[0]),
                                    p1[1] + t * (p2[1] - p1[1])
                                ];
                            };

                            const h_tl = getHeight(x, y);
                            const h_tr = getHeight(x + step, y);
                            const h_br = getHeight(x + step, y + step);
                            const h_bl = getHeight(x, y + step);

                            const top = interpolate(h_tl, h_tr, [x, y], [x + step, y]);
                            const right = interpolate(h_tr, h_br, [x + step, y], [x + step, y + step]);
                            const bottom = interpolate(h_bl, h_br, [x, y + step], [x + step, y + step]);
                            const left = interpolate(h_tl, h_bl, [x, y], [x, y + step]);

                            ctx.beginPath();

                            switch (cellValue) {
                                case 1: case 14:
                                    ctx.moveTo(left[0], left[1]);
                                    ctx.lineTo(bottom[0], bottom[1]);
                                    break;
                                case 2: case 13:
                                    ctx.moveTo(bottom[0], bottom[1]);
                                    ctx.lineTo(right[0], right[1]);
                                    break;
                                case 3: case 12:
                                    ctx.moveTo(left[0], left[1]);
                                    ctx.lineTo(right[0], right[1]);
                                    break;
                                case 4: case 11:
                                    ctx.moveTo(top[0], top[1]);
                                    ctx.lineTo(right[0], right[1]);
                                    break;
                                case 5:
                                    ctx.moveTo(top[0], top[1]);
                                    ctx.lineTo(left[0], left[1]);
                                    ctx.moveTo(bottom[0], bottom[1]);
                                    ctx.lineTo(right[0], right[1]);
                                    break;
                                case 6: case 9:
                                    ctx.moveTo(top[0], top[1]);
                                    ctx.lineTo(bottom[0], bottom[1]);
                                    break;
                                case 7: case 8:
                                    ctx.moveTo(top[0], top[1]);
                                    ctx.lineTo(left[0], left[1]);
                                    break;
                                case 10:
                                    ctx.moveTo(top[0], top[1]);
                                    ctx.lineTo(right[0], right[1]);
                                    ctx.moveTo(left[0], left[1]);
                                    ctx.lineTo(bottom[0], bottom[1]);
                                    break;
                            }

                            ctx.stroke();
                        }
                    }
                };

                marchingSquares(elevation);
            }
        };

        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
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
