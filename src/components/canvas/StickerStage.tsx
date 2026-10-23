import { useEffect, useRef, useState } from 'react';
import { ghostCursors, heroStickers } from './canvasData';

type Point = { x: number; y: number };

const CursorGlyph = ({ color }: { color: string }) => (
    <svg className="cv-cur__glyph" width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
        <path d="M1 1l13 6.5-5.6 1.6L5.8 15z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
);

// Figma-style "other people in the file": each ghost cursor eases between
// random points on the stage, pausing now and then like a real person would.
const GhostCursors = ({ stage }: { stage: React.RefObject<HTMLDivElement | null> }) => {
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const state = ghostCursors.map((_, i) => ({
            from: { x: 0.2 + i * 0.3, y: 0.5 },
            to: { x: Math.random(), y: Math.random() },
            start: performance.now() + i * 600,
            duration: 2200,
        }));

        let frame = 0;
        const tick = (now: number) => {
            const el = stage.current;
            if (el) {
                const { width, height } = el.getBoundingClientRect();
                state.forEach((s, i) => {
                    const t = Math.min(Math.max((now - s.start) / s.duration, 0), 1);
                    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    const x = (s.from.x + (s.to.x - s.from.x) * ease) * width;
                    const y = (s.from.y + (s.to.y - s.from.y) * ease) * height;
                    const node = refs.current[i];
                    if (node) {
                        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                        node.toggleAttribute('data-flip', x > width - 120);
                    }
                    if (t >= 1) {
                        s.from = s.to;
                        s.to = { x: 0.06 + Math.random() * 0.88, y: 0.08 + Math.random() * 0.84 };
                        s.start = now + 400 + Math.random() * 1800;
                        s.duration = 1600 + Math.random() * 1800;
                    }
                });
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [stage]);

    return (
        <>
            {ghostCursors.map((c, i) => (
                <div key={c.name} className="cv-cur" ref={(node) => { refs.current[i] = node; }} aria-hidden="true">
                    <CursorGlyph color={c.color} />
                    <span className="cv-cur__pill" style={{ background: c.color }}>{c.name}</span>
                </div>
            ))}
        </>
    );
};

const StickerStage = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    const youRef = useRef<HTMLDivElement>(null);
    const [offsets, setOffsets] = useState<Record<string, Point>>({});
    const [order, setOrder] = useState<string[]>(heroStickers.map((s) => s.id));
    const [dragging, setDragging] = useState<string | null>(null);
    const drag = useRef<{ id: string; start: Point; origin: Point } | null>(null);

    const onPointerDown = (id: string) => (e: React.PointerEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { id, start: { x: e.clientX, y: e.clientY }, origin: offsets[id] ?? { x: 0, y: 0 } };
        setDragging(id);
        setOrder((prev) => [...prev.filter((s) => s !== id), id]);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const stage = stageRef.current;
        if (stage && youRef.current && e.pointerType === 'mouse') {
            const rect = stage.getBoundingClientRect();
            youRef.current.style.transform = `translate3d(${e.clientX - rect.left}px, ${e.clientY - rect.top}px, 0)`;
        }
        const d = drag.current;
        if (!d) return;
        setOffsets((prev) => ({
            ...prev,
            [d.id]: { x: d.origin.x + e.clientX - d.start.x, y: d.origin.y + e.clientY - d.start.y },
        }));
    };

    const endDrag = () => {
        drag.current = null;
        setDragging(null);
    };

    return (
        <div
            className="cv-stage"
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
        >
            <div className="cv-stage__frame">
                <span className="cv-stage__handle cv-stage__handle--tl" />
                <span className="cv-stage__handle cv-stage__handle--tr" />
                <span className="cv-stage__handle cv-stage__handle--bl" />
                <span className="cv-stage__handle cv-stage__handle--br" />
                <span className="cv-stage__size">Yuga.png · 1200 × 1800</span>
                <img className="cv-stage__portrait" src="/images/portrait/yuga.webp" alt="Yugabharathi outdoors at dusk" fetchPriority="high" draggable={false} />
            </div>

            {heroStickers.map((s) => {
                const o = offsets[s.id] ?? { x: 0, y: 0 };
                return (
                    <button
                        key={s.id}
                        type="button"
                        className={`cv-sticker ${'desktopOnly' in s ? 'cv-sticker--desktop' : ''} ${dragging === s.id ? 'is-dragging' : ''}`}
                        style={{
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: `calc(${s.size}px * var(--cv-sticker-scale, 1))`,
                            zIndex: 10 + order.indexOf(s.id),
                            transform: `translate(-50%, -50%) translate(${o.x}px, ${o.y}px) rotate(${s.rotate}deg)`,
                        }}
                        onPointerDown={onPointerDown(s.id)}
                        aria-label={`${s.label} sticker (drag me)`}
                    >
                        <span className={`cv-sticker__idle ${s.idle}`}>
                            <img src={s.src} alt={s.alt} draggable={false} />
                        </span>
                        <span className="cv-sticker__tag">{s.label}</span>
                    </button>
                );
            })}

            <GhostCursors stage={stageRef} />
            <div className="cv-cur cv-cur--you" ref={youRef} aria-hidden="true">
                <span className="cv-cur__pill" style={{ background: '#222' }}>you</span>
            </div>
            <p className="cv-stage__hint">psst, everything here is draggable</p>
        </div>
    );
};

export default StickerStage;
