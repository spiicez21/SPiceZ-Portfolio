import { useRef } from 'react';
import TopographicBackground from './TopographicBackground';
import { lazy, Suspense } from 'react';

const SpiceZModel = lazy(() => import('./SpiceZModel'));

const F1NameTags = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const drivers = [
        { name: "LEWIS HAMILTON", number: "44", team: "MERCEDES-AMG PETRONAS" },
        { name: "MAX VERSTAPPEN", number: "1", team: "RED BULL RACING" }
    ];

    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '0'
        }}>
            <style>
                {`
                @keyframes slideInTag {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .driver-tag-animate {
                    animation: slideInTag 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                `}
            </style>
            {/* Driver Tags Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {drivers.map((driver, index) => (
                    <div key={index}
                        className="driver-tag-animate"
                        style={{
                            borderLeft: '3px solid var(--accent)',
                            background: 'linear-gradient(90deg, rgba(178, 255, 5, 0.05) 0%, transparent 100%)',
                            padding: '0.75rem 1rem',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            animationDelay: `${index * 0.15}s`,
                            opacity: 0 // Start hidden for animation
                        }}>
                        {/* Top Detail Line */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.25rem',
                            fontSize: '0.6rem', // Smaller font
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            <span>{driver.team}</span>
                            <span style={{ color: 'var(--accent)' }}>/// ACTIVE</span>
                        </div>

                        {/* Content */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end'
                        }}>
                            <h2 style={{
                                fontSize: '1.1rem', // Much smaller Name
                                fontWeight: '800',
                                color: '#fff',
                                lineHeight: 1,
                                margin: 0,
                                fontStyle: 'italic',
                                textTransform: 'uppercase'
                            }}>
                                {driver.name.split(' ')[0]} <span style={{ color: 'var(--accent)' }}>{driver.name.split(' ')[1]}</span>
                            </h2>

                            <div style={{
                                fontSize: '1.8rem', // Smaller Number
                                fontWeight: '900',
                                color: 'transparent',
                                WebkitTextStroke: '1px var(--accent)',
                                opacity: 0.5,
                                lineHeight: 0.8,
                                fontStyle: 'italic'
                            }}>
                                {driver.number}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Topographic Encrypted Box */}
            <div className="topo-box" style={{
                flex: 1, // Fill remaining space
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Background Contours */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                    <TopographicBackground lineColor="rgba(255, 255, 255, 0.1)" />
                </div>

                {/* 3D Model Layer */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                    <Suspense fallback={null}>
                        <SpiceZModel />
                    </Suspense>
                </div>

                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    padding: '2px 6px',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 10
                }}>
                    ENCRYPTED // LOCKED
                </div>

                <div style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    zIndex: 10
                }}>
                    AWAITING ACCESS KEY...
                </div>
            </div>
        </div>
    );
};

export default F1NameTags;
