import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pending = 0;

/**
 * ScrollTrigger.refresh() re-measures every trigger on the page and is one of
 * the most expensive calls in GSAP. Sections mounting, images decoding and
 * resize events all want one, so coalesce them into a single trailing call.
 */
export const scheduleScrollTriggerRefresh = (delay = 150) => {
    if (pending) clearTimeout(pending);
    pending = window.setTimeout(() => {
        pending = 0;
        ScrollTrigger.refresh();
    }, delay);
};
