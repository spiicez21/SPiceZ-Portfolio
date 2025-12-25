import { useEffect, useState } from 'react';
import { FaGlobe, FaWifi } from 'react-icons/fa';

const TechnicalInfoBox = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const containerStyle: React.CSSProperties = {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.9)', /* Brighter text */
        background: 'rgba(5, 5, 5, 0.99)', /* Deep black background */
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid rgba(178, 255, 5, 0.3)', /* Neon accent border */
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        width: 'fit-content'
    };

    const rowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.25rem'
    };

    const labelStyle: React.CSSProperties = {
        color: '#b2ff05', // Neon
        fontWeight: 600,
        textTransform: 'uppercase'
    };

    return (
        <div className="technical-info-box" style={containerStyle}>
            <div style={rowStyle}>
                <span style={labelStyle}>COORDS</span>
                <span>13.0827° N, 80.2707° E</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>SYSTEM</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ONLINE <FaWifi size={10} color="#00ff00" />
                </span>
            </div>
            <div style={{ ...rowStyle, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={labelStyle}>LOCAL</span>
                <span>{time}</span>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaGlobe /> SPICEZ_NET // V2.4.0
            </div>
        </div>
    );
};

export default TechnicalInfoBox;
