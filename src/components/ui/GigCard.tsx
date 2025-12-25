import { useRef, useLayoutEffect } from 'react';
import { FaCircle, FaTerminal } from 'react-icons/fa';
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
                .fromTo(".tech-row:first-child",
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
                    "-=0.2"
                )
                .fromTo(".service-item",
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power3.out" },
                    "-=0.2"
                )
                .fromTo(".tech-footer",
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );

        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="gig-card technical-info-box" style={{ opacity: 0 }}>
            <div className="tech-row">
                <span className="tech-label">COMMISSION</span>
                <span className="tech-status">
                    OPEN <FaCircle size={8} color="#b2ff05" className="pulse-icon" />
                </span>
            </div>

            <div className="tech-row">
                <span className="tech-label">SERVICES</span>
                <div className="tech-services">
                    <div className="service-item">UI/UX Design</div>
                    <div className="service-item">Full Stack Dev</div>
                    <div className="service-item">YT Assets</div>
                </div>
            </div>

            <div className="tech-footer">
                <FaTerminal size={10} /> YUGA_BHARATHI // CORE_V2
            </div>
        </div>
    );
};

export default GigCard;
