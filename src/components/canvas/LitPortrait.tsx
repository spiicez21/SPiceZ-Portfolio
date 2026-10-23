import { useEffect, useMemo, useRef, useState } from 'react';

/*
 * Portrait lit by a string of serial lights.
 *
 * The SVG strand is draped across the card's top-right corner. Every bulb is
 * also a coloured point light in a small WebGL pass that relights the photo
 * from a pre-baked normal + depth map. The canvas only outputs the *added*
 * light and is composited over the <img> with `plus-lighter`, so if WebGL is
 * unavailable the page simply shows the plain photo.
 */

const PORTRAIT = '/images/portrait/yuga.webp';
const NORMAL = '/images/portrait/yuga-normal.webp';
const DEPTH = '/images/portrait/yuga-depth.webp';
// The <img> sits inset 8px inside the card; must match .cv-about__photo img.
const INSET = 8;
const OBJECT_POS_Y = 0.2;

const COLORS = ['#ff3b3b', '#ffb020', '#3ddc84', '#3b9bff', '#ff4fd8', '#ffe27a'];
const SPACING = 24;
const MAX_LIGHTS = 16;

type Pt = { x: number; y: number };
type Bulb = Pt & { angle: number; color: string; rgb: number[]; i: number };

const qPoint = (a: Pt, c: Pt, b: Pt, t: number): Pt => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y,
});
const qTangent = (a: Pt, c: Pt, b: Pt, t: number): Pt => ({
    x: 2 * (1 - t) * (c.x - a.x) + 2 * t * (b.x - c.x),
    y: 2 * (1 - t) * (c.y - a.y) + 2 * t * (b.y - c.y),
});

// Seeded so bulbs keep the same tilt/timing between renders.
const rand = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s);
};

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

// Pinned on the top edge, sagging under gravity, taped to the right edge.
const buildStrand = (w: number) => {
    const a = { x: w * 0.38, y: -2 };
    const b = { x: w + 2, y: Math.min(w * 0.5, 140) };
    const sag = w * 0.16;
    const c = { x: (a.x + b.x) / 2 - sag * 0.35, y: (a.y + b.y) / 2 + sag };

    const count = Math.max(3, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / SPACING));
    const bulbs: Bulb[] = Array.from({ length: Math.min(count - 1, MAX_LIGHTS) }, (_, k) => {
        const t = (k + 1) / count;
        const p = qPoint(a, c, b, t);
        const tan = qTangent(a, c, b, t);
        const slope = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
        const angle = (slope > 90 ? slope - 180 : slope) * 0.3 + (rand(k) - 0.5) * 16;
        const color = COLORS[k % COLORS.length];
        return { ...p, angle, color, rgb: hexToRgb(color), i: k };
    });

    return { d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`, a, b, bulbs };
};

// Irregular flicker, like cheap serial lights: mostly on, with a quick dip.
const FLICKER: [number, number][] = [[0, 1], [0.45, 0.82], [0.5, 0.35], [0.56, 0.9], [1, 1]];
const brightness = (i: number, seconds: number) => {
    const dur = 2.2 + rand(i + 7) * 2.6;
    const p = ((seconds + rand(i + 3) * 4) % dur) / dur;
    for (let k = 1; k < FLICKER.length; k++) {
        const [p1, v1] = FLICKER[k];
        const [p0, v0] = FLICKER[k - 1];
        if (p <= p1) return v0 + ((p - p0) / (p1 - p0)) * (v1 - v0);
    }
    return 1;
};

/* ───────────── WebGL relight ───────────── */

const VERT = `
attribute vec2 aPos;
uniform vec2 uRes;
varying vec2 vPx;
void main() {
  vPx = (aPos * 0.5 + 0.5) * uRes;
  vPx.y = uRes.y - vPx.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
#define MAX ${MAX_LIGHTS}
uniform sampler2D uAlbedo;
uniform sampler2D uNormal;
uniform sampler2D uDepth;
uniform vec4 uCover;
uniform vec3 uLightPos[MAX];
uniform vec3 uLightCol[MAX];
uniform int uCount;
uniform vec3 uBackdrop;
uniform float uGain;
varying vec2 vPx;

void main() {
  vec2 uv = (vPx - uCover.xy) / uCover.zw;
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec4 alb = texture2D(uAlbedo, uv) * inside;
  vec3 nTex = texture2D(uNormal, uv).xyz * 2.0 - 1.0;
  float h = texture2D(uDepth, uv).r * inside;

  // Fabric / skin bounce more light than their dark albedo suggests.
  vec3 albedo = mix(uBackdrop, mix(alb.rgb, vec3(0.5), 0.12), alb.a);
  vec3 N = normalize(mix(vec3(0.0, 0.0, 1.0), nTex, alb.a));
  vec3 P = vec3(vPx, h * 34.0);

  vec3 acc = vec3(0.0);
  for (int i = 0; i < MAX; i++) {
    if (i >= uCount) break;
    vec3 Ld = uLightPos[i] - P;
    float dist = length(Ld);
    vec3 L = Ld / dist;
    float att = 1.0 / (1.0 + dist * dist / 1500.0);
    float diff = max(dot(N, L), 0.0);
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, H), 0.0), 32.0) * 0.45 * alb.a;
    acc += uLightCol[i] * att * (diff * albedo + spec);
  }
  gl_FragColor = vec4(acc * uGain, 1.0);
}`;

type GL = {
    gl: WebGLRenderingContext;
    u: Record<string, WebGLUniformLocation | null>;
    ready: boolean;
    imgW: number;
    imgH: number;
};

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
};

const initGL = (canvas: HTMLCanvasElement): GL | null => {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: false, antialias: false });
    if (!gl) return null;
    try {
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
        gl.useProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const names = ['uRes', 'uCover', 'uLightPos', 'uLightCol', 'uCount', 'uBackdrop', 'uGain', 'uAlbedo', 'uNormal', 'uDepth'];
        const u = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)]));
        return { gl, u, ready: false, imgW: 2, imgH: 3 };
    } catch (err) {
        console.warn('Portrait relight disabled:', err);
        return null;
    }
};

const loadTextures = (g: GL) => {
    const { gl, u } = g;
    const srcs = [PORTRAIT, NORMAL, DEPTH];
    const units = ['uAlbedo', 'uNormal', 'uDepth'];
    let loaded = 0;
    srcs.forEach((src, i) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(u[units[i]], i);
            if (i === 0) {
                g.imgW = img.naturalWidth;
                g.imgH = img.naturalHeight;
            }
            if (++loaded === srcs.length) g.ready = true;
        };
        img.src = src;
    });
};

/* ───────────── Component ───────────── */

const FRAME_MS = 1000 / 30; // the flicker is slow; 30fps is indistinguishable
const LIGHT_REACH = 190; // px beyond which a bulb adds < ~4% light

type Strand = ReturnType<typeof buildStrand>;

const LitPortrait = () => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const litRefs = useRef<(SVGEllipseElement | null)[]>([]);
    const bloomRefs = useRef<(SVGEllipseElement | null)[]>([]);
    const strandRef = useRef<Strand | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const strand = useMemo(() => (width ? buildStrand(width) : null), [width]);
    useEffect(() => {
        strandRef.current = strand;
    }, [strand]);

    // One render loop for the lifetime of the card; geometry is read from a ref
    // so resizing never rebuilds the GL context or re-uploads textures.
    useEffect(() => {
        const canvas = canvasRef.current;
        const card = wrapRef.current?.parentElement;
        if (!canvas || !card) return;

        const themeRoot = card.closest('.cv');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
        const lightPos = new Float32Array(MAX_LIGHTS * 3);
        const lightCol = new Float32Array(MAX_LIGHTS * 3);
        const lastLevel: number[] = [];
        let g: GL | null = null;
        let visible = false;
        let frame = 0;
        let lastDraw = -Infinity;

        // Lazy: no GL context or map downloads until the card is close to view.
        const start = () => {
            if (g || saveData) return;
            g = initGL(canvas);
            if (g) loadTextures(g);
            else canvas.style.display = 'none';
        };
        if (saveData) canvas.style.display = 'none';

        const draw = (seconds: number) => {
            const s = strandRef.current;
            if (!s) return;
            const levels = s.bulbs.map((b) => (reduceMotion ? 1 : brightness(b.i, seconds)));

            // SVG bulbs follow the same flicker; skip writes too small to see.
            levels.forEach((v, i) => {
                if (Math.abs((lastLevel[i] ?? -1) - v) < 0.02) return;
                lastLevel[i] = v;
                const lit = litRefs.current[i];
                const bloom = bloomRefs.current[i];
                if (lit) lit.style.opacity = v.toFixed(2);
                if (bloom) bloom.style.opacity = (0.15 + 0.85 * ((v - 0.35) / 0.65)).toFixed(2);
            });

            if (!g?.ready) return;
            const { gl, u } = g;
            const cssW = canvas.clientWidth;
            const cssH = canvas.clientHeight;
            // Lighting is low-frequency, so 1x resolution is plenty even on retina.
            if (canvas.width !== cssW || canvas.height !== cssH) {
                canvas.width = cssW;
                canvas.height = cssH;
            }
            gl.viewport(0, 0, cssW, cssH);

            // Only shade pixels the bulbs can actually reach.
            const xs = s.bulbs.map((b) => b.x - INSET);
            const ys = s.bulbs.map((b) => b.y - INSET);
            const x0 = Math.max(0, Math.floor(Math.min(...xs) - LIGHT_REACH));
            const y1 = Math.min(cssH, Math.ceil(Math.max(...ys) + LIGHT_REACH));
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x0, cssH - y1, cssW - x0, y1);

            // Replicate object-fit: cover; object-position: 50% 20%.
            const k = Math.max(cssW / g.imgW, cssH / g.imgH);
            const dw = g.imgW * k;
            const dh = g.imgH * k;
            gl.uniform2f(u.uRes, cssW, cssH);
            gl.uniform4f(u.uCover, (cssW - dw) * 0.5, (cssH - dh) * OBJECT_POS_Y, dw, dh);

            s.bulbs.forEach((b, i) => {
                // Glass centre of the bulb, ~12px below the wire, in canvas space.
                const rad = (b.angle * Math.PI) / 180;
                lightPos.set([b.x - INSET - Math.sin(rad) * 12, b.y - INSET + Math.cos(rad) * 12, 30], i * 3);
                const [r, gr, bl] = b.rgb;
                lightCol.set([r * levels[i], gr * levels[i], bl * levels[i]], i * 3);
            });
            gl.uniform3fv(u.uLightPos, lightPos);
            gl.uniform3fv(u.uLightCol, lightCol);
            gl.uniform1i(u.uCount, s.bulbs.length);

            const dark = themeRoot?.getAttribute('data-theme') === 'dark';
            // Light mode: the pale backdrop would just clip to white, so only light the photo.
            gl.uniform3fv(u.uBackdrop, dark ? [0.12, 0.13, 0.16] : [0, 0, 0]);
            gl.uniform1f(u.uGain, dark ? 0.7 : 0.55);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const tick = (now: number) => {
            frame = 0;
            if (!visible) return;
            if (now - lastDraw >= FRAME_MS) {
                lastDraw = now;
                draw(now / 1000);
            }
            // Reduced motion: keep going only until the textures are in, then hold.
            if (!reduceMotion || !g || !g.ready) frame = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) start();
            visible = e.isIntersecting;
            if (visible && !frame) frame = requestAnimationFrame(tick);
        }, { rootMargin: '200px' });
        io.observe(card);

        return () => {
            cancelAnimationFrame(frame);
            io.disconnect();
            g?.gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    return (
        <>
            <img className="cv-about__img" src={PORTRAIT} alt="Portrait of Yugabharathi" loading="lazy" />
            <canvas ref={canvasRef} className="cv-relight" aria-hidden="true" />
            <div className="cv-lights-string" ref={wrapRef} aria-hidden="true">
                {strand && (
                    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
                        <defs>
                            {COLORS.map((c, i) => (
                                <radialGradient key={c} id={`cv-bulb-${i}`} cx="45%" cy="62%" r="65%">
                                    <stop offset="0" stopColor="#fff" />
                                    <stop offset="0.28" stopColor="#fff" stopOpacity="0.85" />
                                    <stop offset="0.55" stopColor={c} />
                                    <stop offset="1" stopColor={c} stopOpacity="0.55" />
                                </radialGradient>
                            ))}
                            {/* Soft bloom as a gradient: no filter to re-rasterise every frame. */}
                            {COLORS.map((c, i) => (
                                <radialGradient key={`g${c}`} id={`cv-glow-${i}`}>
                                    <stop offset="0" stopColor={c} stopOpacity="0.9" />
                                    <stop offset="0.4" stopColor={c} stopOpacity="0.45" />
                                    <stop offset="1" stopColor={c} stopOpacity="0" />
                                </radialGradient>
                            ))}
                        </defs>

                        {/* Twisted two-strand wire: dark core plus a faint highlight offset */}
                        <path d={strand.d} className="cv-wire" />
                        <path d={strand.d} className="cv-wire__hi" transform="translate(0 -0.6)" />
                        <circle cx={strand.a.x} cy={strand.a.y} r="2.6" className="cv-wire__pin" />
                        <rect x={strand.b.x - 9} y={strand.b.y - 5} width="18" height="9" rx="1.5" className="cv-wire__tape" transform={`rotate(-38 ${strand.b.x} ${strand.b.y})`} />

                        {strand.bulbs.map((b, idx) => {
                            const ci = COLORS.indexOf(b.color);
                            return (
                                <g key={b.i} transform={`translate(${b.x} ${b.y}) rotate(${b.angle}) scale(1.15)`}>
                                    <g className="cv-bulb__bloom">
                                        <ellipse ref={(n) => { bloomRefs.current[idx] = n; }} cx="0" cy="11" rx="15" ry="17" fill={`url(#cv-glow-${ci})`} />
                                    </g>
                                    <rect x="-2.2" y="0" width="4.4" height="5" rx="1" className="cv-bulb__socket" />
                                    <ellipse cx="0" cy="10.5" rx="3.4" ry="6" fill={b.color} opacity="0.45" />
                                    <ellipse ref={(n) => { litRefs.current[idx] = n; }} cx="0" cy="10.5" rx="3.4" ry="6" fill={`url(#cv-bulb-${ci})`} />
                                    <ellipse cx="-1.1" cy="8" rx="0.8" ry="1.8" fill="#fff" opacity="0.7" />
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>
        </>
    );
};

export default LitPortrait;
