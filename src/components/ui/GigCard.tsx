import { useRef, useLayoutEffect } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './GigCard.css';

const GigCard = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.3 });

            tl.fromTo(cardRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            )
                .fromTo(".pit-header",
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
                    "-=0.2"
                )
                .fromTo(".strategy-pill",
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.12, ease: "power3.out" },
                    "-=0.2"
                )
                .fromTo(".pit-footer",
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );

        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="gig-card pit-window" style={{ opacity: 0 }}>
            <div className="pit-header">
                <span className="pit-title">COMMISSION STATUS</span>
                <span className="pit-status">OPEN</span>
            </div>

            <div className="pit-body">
                <div className="strategy-pill">
                    <span className="strat-icon">01</span>
                    <span className="strat-name">UI/UX Design</span>
                </div>
                <div className="strategy-pill">
                    <span className="strat-icon">02</span>
                    <span className="strat-name">Full Stack Dev</span>
                </div>
                <div className="strategy-pill">
                    <span className="strat-icon">03</span>
                    <span className="strat-name">YT Assets</span>
                </div>
            </div>

            <div className="pit-footer">
                powered by <span>YUGA BHARATHI</span>
            </div>
        </div>
    );
};

export default GigCard;
