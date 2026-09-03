import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

interface LazyMountProps {
    children: ReactNode;
    /** Placeholder height reserved before the section mounts (avoids layout shift). */
    minHeight?: string;
    /** How far ahead of the viewport (px) to start mounting. */
    margin?: number;
}

/**
 * Shared scroll watcher.
 *
 * IntersectionObserver is the obvious tool here but it is unreliable for this
 * job: it only fires when the intersection state *changes*, so a placeholder
 * that goes from "below the viewport" to "above the viewport" in one frame -
 * which happens whenever a pinned section re-measures and the page jumps -
 * never intersects and therefore never mounts. A single rAF-throttled scroll
 * pass over the handful of still-pending placeholders is both robust and
 * cheaper than one observer per section.
 */
type Pending = { el: HTMLElement; margin: number; mount: () => void };

const pending = new Set<Pending>();
let listening = false;
let rafId = 0;

const check = () => {
    rafId = 0;
    const limit = window.innerHeight;
    for (const item of [...pending]) {
        // Sections always sit below their placeholder's entry point, so a single
        // condition covers both "approaching" and "already scrolled past".
        if (item.el.getBoundingClientRect().top < limit + item.margin) {
            pending.delete(item);
            item.mount();
        }
    }
    if (pending.size === 0) teardown();
};

const schedule = () => {
    if (!rafId) rafId = requestAnimationFrame(check);
};

const teardown = () => {
    if (!listening) return;
    listening = false;
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', schedule);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
};

const observe = (item: Pending) => {
    pending.add(item);
    if (!listening) {
        listening = true;
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        // rAF is frozen while the tab is hidden, so re-check on the way back in.
        document.addEventListener('visibilitychange', schedule);
    }
    schedule();
    return () => {
        pending.delete(item);
        if (pending.size === 0) teardown();
    };
};

/**
 * Defers both the dynamic import and the render of a section until it is near
 * the viewport. Without this, every `lazy()` section under a `<Suspense>` is
 * rendered on mount, so all their chunks download during initial load.
 */
const LazyMount = ({ children, minHeight = '25rem', margin = 600 }: LazyMountProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || mounted) return;
        return observe({ el, margin, mount: () => setMounted(true) });
    }, [margin, mounted]);

    return (
        // `display: contents` once mounted so the wrapper adds no box of its own
        // and section CSS/layout behaves exactly as before.
        <div ref={ref} style={mounted ? { display: 'contents' } : { minHeight }}>
            {mounted ? <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense> : null}
        </div>
    );
};

export default LazyMount;
