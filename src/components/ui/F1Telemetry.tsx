import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const F1Telemetry = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Text Refs for direct manipulation (Performance)
    const s1TextRef = useRef<HTMLSpanElement>(null);
    const s2TextRef = useRef<HTMLSpanElement>(null);
    const s3TextRef = useRef<HTMLSpanElement>(null);
    const totalTextRef = useRef<HTMLSpanElement>(null);

    // Bar Refs
    const s1BarRef = useRef<HTMLDivElement>(null);
    const s2BarRef = useRef<HTMLDivElement>(null);
    const s3BarRef = useRef<HTMLDivElement>(null);

    // Box Refs for Flashing
    const s1BoxRef = useRef<HTMLDivElement>(null);
    const s2BoxRef = useRef<HTMLDivElement>(null);
    const s3BoxRef = useRef<HTMLDivElement>(null);
    const totalBoxRef = useRef<HTMLDivElement>(null);

    // Track Refs
    const trackS1Ref = useRef<SVGPathElement>(null);
    const trackS2Ref = useRef<SVGPathElement>(null);
    const trackS3Ref = useRef<SVGPathElement>(null);

    // Targets
    const T = {
        s1: 26.566,
        s2: 26.180,
        s3: 26.014,
        total: 78.760
    };

    useGSAP(() => {
        // Helpers
        const format = (n: number) => n.toFixed(3);
        const formatTotal = (n: number) => {
            const min = Math.floor(n / 60);
            const sec = (n % 60).toFixed(3).padStart(6, '0');
            return `${min}:${sec}`;
        };

        const flash = (el: HTMLElement | null) => {
            if (el) {
                gsap.fromTo(el,
                    { backgroundColor: 'rgba(209, 0, 209, 0.8)', color: '#fff' },
                    { backgroundColor: 'transparent', color: 'inherit', duration: 0.3, clearProps: 'all' }
                );
            }
        };

        const timer = { val: 0 }; // Define timer here so resetAll can access it

        const resetAll = () => {
            timer.val = 0; // Reset tweening values
            if (s1TextRef.current) s1TextRef.current.textContent = "0.000";
            if (s2TextRef.current) s2TextRef.current.textContent = "0.000";
            if (s3TextRef.current) s3TextRef.current.textContent = "0.000";
            if (totalTextRef.current) totalTextRef.current.textContent = "0:00.000";

            // Explicitly reset bars to 0 width
            if (s1BarRef.current) s1BarRef.current.style.width = '0%';
            if (s2BarRef.current) s2BarRef.current.style.width = '0%';
            if (s3BarRef.current) s3BarRef.current.style.width = '0%';

            // Reset Track
            [trackS1Ref, trackS2Ref, trackS3Ref].forEach(ref => {
                if (ref.current) {
                    const len = ref.current.getTotalLength();
                    ref.current.style.strokeDasharray = `${len}`;
                    ref.current.style.strokeDashoffset = `${len}`;
                    ref.current.style.opacity = '0.3'; // Dimmed when not active
                    ref.current.style.stroke = '#444'; // Inactive color
                }
            });
        };

        // Track Activator
        const activateTrack = (ref: React.RefObject<SVGPathElement | null>, duration: number) => {
            if (!ref.current) return;
            const len = ref.current.getTotalLength();
            gsap.set(ref.current, { stroke: '#d100d1', opacity: 1, strokeDasharray: len, strokeDashoffset: len });
            gsap.to(ref.current, {
                strokeDashoffset: 0,
                duration: duration,
                ease: 'none'
            });
        };

        // Initialize timeline
        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 1, // 1 second before next lap
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom", // Start as soon as it enters viewport
                toggleActions: "play none none none" // Keep running once started
            },
            onRepeat: resetAll // Ensure text resets explicitly
        });

        // Ensure clean state at start
        tl.call(resetAll);


        // --- SECTOR 1 ---
        // Run S1 from 0 to Target
        tl.call(() => activateTrack(trackS1Ref, T.s1));
        tl.to(timer, {
            val: T.s1,
            duration: T.s1,
            ease: "none",
            onUpdate: () => {
                if (s1TextRef.current) s1TextRef.current.textContent = format(timer.val);
                if (totalTextRef.current) totalTextRef.current.textContent = formatTotal(timer.val);
                if (s1BarRef.current) s1BarRef.current.style.width = `${(timer.val / T.s1) * 100}%`;
            },
            onComplete: () => {
                flash(s1BoxRef.current);
                if (s1BarRef.current) s1BarRef.current.style.width = '100%';
            }
        });

        // --- SECTOR 2 ---
        tl.call(() => { timer.val = 0; activateTrack(trackS2Ref, T.s2); }); // Reset split timer
        tl.to(timer, {
            val: T.s2,
            duration: T.s2,
            ease: "none",
            onUpdate: () => {
                if (s2TextRef.current) s2TextRef.current.textContent = format(timer.val);
                if (totalTextRef.current) totalTextRef.current.textContent = formatTotal(T.s1 + timer.val);
                if (s2BarRef.current) s2BarRef.current.style.width = `${(timer.val / T.s2) * 100}%`;
            },
            onComplete: () => {
                flash(s2BoxRef.current);
                if (s2BarRef.current) s2BarRef.current.style.width = '100%';
            }
        });

        // --- SECTOR 3 ---
        tl.call(() => { timer.val = 0; activateTrack(trackS3Ref, T.s3); });
        tl.to(timer, {
            val: T.s3,
            duration: T.s3,
            ease: "none",
            onUpdate: () => {
                if (s3TextRef.current) s3TextRef.current.textContent = format(timer.val);
                if (totalTextRef.current) totalTextRef.current.textContent = formatTotal(T.s1 + T.s2 + timer.val);
                if (s3BarRef.current) s3BarRef.current.style.width = `${(timer.val / T.s3) * 100}%`;
            },
            onComplete: () => {
                flash(s3BoxRef.current);
                if (s3BarRef.current) s3BarRef.current.style.width = '100%';
            }
        });

        // --- FINISH ---
        tl.call(() => {
            flash(totalBoxRef.current);
            if (totalTextRef.current) totalTextRef.current.textContent = "1:18.760";
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="footer-telemetry">
            {/* SVG Track Map */}
            <div className="track-map" style={{ position: 'absolute', bottom: '100%', marginBottom: '1rem', right: '0', width: '6.25rem', height: '9.375rem', zIndex: 0, opacity: 0.8 }}>
                <svg viewBox="0 0 629.8 1031.3" style={{ height: '100%', width: 'auto', overflow: 'visible' }}>
                    {/* Full Track Ghost */}
                    <path className="st0" d="M32.7,797.6c12.9-131.4,26.7-263,37.1-394.4c1.7-11.2,0.5-23,4.2-33.8
                        c7.8-13.4,28.4,1.2,20.2-31c-9.6-27.7-14.1-57.5-10.8-86.9c1.1-28,4.9-56.9,17.8-82.2c21.1-44.7,66.3-73.6,113.6-84.1
                        c44.9-7.5,91.1-8.3,136.2-10.8c14.2-0.9,28.4-1.6,42.3-1.9c11.1-1.7,26.8,1.1,31.9-11.3c6.9-14.7,23.3-17.8,37.6-20.7
                        c14.6-4,28.6-9.3,42.7-13.6c22.9-7.5,45.5-19,69.5-20.2c20.7,0.9,37.6,18,39.9,38c2.5,22.7,4,45.6,6.1,68.1
                        c4.7,31.9,2.7,52.3-29.1,66.2c-49.5,26.5-100.3,51.8-146,84.1c-51.9,41.8-101.7,86.5-151.7,129.6c-16.5,14.6-33,28.5-48.8,42.7
                        c-9.2,8.2-19.7,15.7-23,27.7c-3.4,12.1,0.3,25-3.3,36.6c-5.4,20.8-26.1,32.5-31.9,52.6c-9,36.5-7.3,74.3-11.7,110.8
                        c-5.6,66.9-12.7,133.5-19.7,199.6c-3.5,32.4-6.2,64.3-9.9,95.8c-1.2,15.4-1.5,30.7-8,44.1c-10.3,18.2-33,25.6-52.1,19.7
                        c-51.3-16.4-55.4-79.3-55.8-124.5C29.6,864.2,29.2,831,32.7,797.6z" stroke="#333" strokeWidth="20" fill="none" />

                    {/* S1: Red -> Purple */}
                    <path ref={trackS1Ref} d="M32.7,797.6C42.4,697,53.5,596.4,61.8,495.7c2.7-29,5.5-58.3,7.5-87.3
                        c3.2-11.8-2.5-43,13.1-45.1c17.9-1.5,14.3-17.1,10.3-29.6c-3.3-10.9-6.5-22-8.5-33.3c-9-91.5,13-175.6,108-208.5
                        c36.6-12.9,76.3-12.3,114.6-15" stroke="#d100d1" strokeWidth="40" fill="none" strokeLinecap="round" />

                    {/* S2: Blue -> Purple */}
                    <path ref={trackS2Ref} d="M306.9,76.8c24.5-1.5,49.2-2.8,73.7-3.8c12.7-1.4,26.7,0.8,38.5-4.7
                        c6.2-4.1,8.1-11.7,13.1-16.9C448.1,41,468.2,41,485.4,33.6c18.2-5.8,36.3-12.5,54.5-18.8c13.1-4.2,26.5-9.5,40.4-7.5
                        c39.3,8.5,35.2,47,38.5,78.4c0.2,28.7,15.9,67.5-14.1,86.4c-49.8,27.4-101.3,52.6-148.9,84.1c-54,40.8-103.6,87-155,131" stroke="#d100d1" strokeWidth="40" fill="none" strokeLinecap="round" />

                    {/* S3: Yellow -> Purple */}
                    <path ref={trackS3Ref} d="M300.8,387.2c-17.8,15.2-35.3,30.9-53.1,46c-9,8.9-20.2,15.9-24.9,28.2
                        c-4.4,15.5,1.1,32.6-7,47.4c-5.5,11.5-15.8,19.8-22.5,30.5c-14.4,26.7-11.6,58.6-15,87.8c-3.9,57.2-9.8,114.3-16,171.4
                        c-4.5,47.6-9.7,95.2-14.6,142.7c-3.1,20.5-1.2,42.4-9.9,61.5c-11.3,20.2-38,27-58.7,17.4c-45.7-20.6-48.6-78.3-49.3-122.1
                        c-0.3-33.5-0.7-67.2,2.8-100.5" stroke="#d100d1" strokeWidth="40" fill="none" strokeLinecap="round" />
                </svg>
            </div>

            <div className="telemetry-data">
                <div className="telemetry-group">
                    <span className="telemetry-label">DRIVER</span>
                    <span className="telemetry-value text-neon">HAM</span>
                </div>
                <div className="telemetry-sep">/</div>
                <div className="telemetry-group">
                    <span className="telemetry-label">NO.</span>
                    <span className="telemetry-value text-purple">44</span>
                </div>


                <div className="telemetry-track">
                    {/* Sector 1 */}
                    <div className="sector-cell" ref={s1BoxRef}>
                        <div className="sector-time">
                            <span className="telemetry-label">S1</span>
                            <span ref={s1TextRef} className="telemetry-value text-purple nums">0.000</span>
                        </div>
                        <div className="sector-bar">
                            <div ref={s1BarRef} className="sector-fill" style={{ width: 0 }} />
                        </div>
                    </div>

                    {/* Sector 2 */}
                    <div className="sector-cell" ref={s2BoxRef}>
                        <div className="sector-time">
                            <span className="telemetry-label">S2</span>
                            <span ref={s2TextRef} className="telemetry-value text-purple nums">0.000</span>
                        </div>
                        <div className="sector-bar">
                            <div ref={s2BarRef} className="sector-fill" style={{ width: 0 }} />
                        </div>
                    </div>

                    {/* Sector 3 */}
                    <div className="sector-cell" ref={s3BoxRef}>
                        <div className="sector-time">
                            <span className="telemetry-label">S3</span>
                            <span ref={s3TextRef} className="telemetry-value text-purple nums">0.000</span>
                        </div>
                        <div className="sector-bar">
                            <div ref={s3BarRef} className="sector-fill" style={{ width: 0 }} />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="sector-total total-text" ref={totalBoxRef} style={{ opacity: 1 }}>
                        <span ref={totalTextRef} className="telemetry-value text-purple nums">0:00.000</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default F1Telemetry;
