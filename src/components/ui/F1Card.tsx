import { memo } from 'react';
import './F1Card.css';

const F1Card = memo(() => {
    return (
        <div className="f1-card">
            <div className="f1-card-content">
                <span className="f1-label">CURRENT LOCATION</span>

                {/* Abstract Tech/Map Shape representing 'Base' */}
                <svg className="track-map-svg" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,30 L35,20 L65,20 L80,30 L65,40 L35,40 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="30" r="4" fill="currentColor" />
                    <path d="M50,10 V20 M50,40 V50 M20,30 H10 M80,30 H90" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>

                <div className="race-name">CHENNAI, IND</div>

                <div className="divider-line"></div>

                <div className="team-section">
                    <div className="helmet-icon-wrapper">
                        {/* Left Laurel */}
                        <svg className="laurel-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 22C7 22 4 18 4 12C4 6 9 2 9 2" strokeLinecap="round" />
                            <path d="M7 17L5 15" strokeLinecap="round" />
                            <path d="M6 13L4 11" strokeLinecap="round" />
                            <path d="M8 9L6 7" strokeLinecap="round" />
                        </svg>

                        {/* Code/Laptop Icon instead of Helmet */}
                        <svg className="helmet-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 16V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V16" />
                            <path d="M2 16H22" />
                            <path d="M12 16V20" />
                            <path d="M8 20H16" />
                        </svg>

                        {/* Right Laurel */}
                        <svg className="laurel-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'scaleX(-1)' }}>
                            <path d="M7 22C7 22 4 18 4 12C4 6 9 2 9 2" strokeLinecap="round" />
                            <path d="M7 17L5 15" strokeLinecap="round" />
                            <path d="M6 13L4 11" strokeLinecap="round" />
                            <path d="M8 9L6 7" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="team-name">SPICEZ DEV</div>
                    <span className="since-label">EST. 2021</span>
                </div>
            </div>
        </div>
    );
});

export default F1Card;
