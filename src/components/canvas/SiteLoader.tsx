import { useEffect, useState } from 'react';
import { dishes, dockApps, footerDrivers, heroStickers, interests } from './canvasData';

// Everything the home page shows, so nothing pops in after the reveal.
const ASSETS = Array.from(new Set([
    '/brand/logo.svg',
    '/images/portrait/yuga.webp',
    '/images/portrait/yuga-normal.webp',
    '/images/portrait/yuga-depth.webp',
    ...heroStickers.map((s) => s.src),
    ...dishes.map((d) => d.src),
    ...dockApps.map((a) => `/images/apps/${a.id}.webp`),
    ...footerDrivers.map((d) => d.src),
    ...interests.flatMap((i) => (i.image ? [i.image] : [])),
]));

const TIPS = ['Warming up the filter coffee', 'Lights out and away we go', 'Arranging the desk', 'Untangling the serial lights'];
const MIN_MS = 700; // avoid a flash on fast connections
const MAX_MS = 8000; // never hold the page hostage to one slow file

const SiteLoader = () => {
    const [done, setDone] = useState(0);
    const [hidden, setHidden] = useState(false);
    const [gone, setGone] = useState(false);
    const total = ASSETS.length + 1; // +1 for fonts

    useEffect(() => {
        const root = document.documentElement;
        root.style.overflow = 'hidden';
        const started = performance.now();
        let finished = false;

        const finish = () => {
            if (finished) return;
            finished = true;
            const wait = Math.max(0, MIN_MS - (performance.now() - started));
            setTimeout(() => {
                setHidden(true);
                root.style.overflow = '';
                setTimeout(() => setGone(true), 600);
            }, wait);
        };

        const tick = () => setDone((n) => n + 1);
        const jobs = ASSETS.map((src) => new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => { tick(); resolve(); };
            img.src = src;
        }));
        jobs.push(document.fonts.ready.then(() => { tick(); }));

        Promise.all(jobs).then(finish);
        const timeout = setTimeout(finish, MAX_MS);
        return () => {
            clearTimeout(timeout);
            root.style.overflow = '';
        };
    }, []);

    if (gone) return null;
    const pct = Math.round((Math.min(done, total) / total) * 100);

    return (
        <div className={`cv-loader ${hidden ? 'is-hidden' : ''}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
            <div className="cv-loader__logo">
                <img src="/brand/logo.svg" alt="" />
                <img className="cv-loader__fill" src="/brand/logo.svg" alt="" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
            </div>
            <div className="cv-loader__bar"><i style={{ width: `${pct}%` }} /></div>
            <p className="cv-loader__meta">
                <span>{TIPS[Math.min(TIPS.length - 1, Math.floor((pct / 100) * TIPS.length))]}…</span>
                <b>{String(pct).padStart(2, '0')}%</b>
            </p>
        </div>
    );
};

export default SiteLoader;
