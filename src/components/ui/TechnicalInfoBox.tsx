import { memo } from 'react';

const TechnicalInfoBox = () => {
    return (
        <div className="technical-info-box" style={{
            position: 'absolute',
            bottom: '4rem',
            left: '4rem',
            zIndex: 30,
            fontFamily: "var(--font-mono)",
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '240px'
        }}>
            <div className="info-group">
                <div style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.1em' }}>NEXT RELEASE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>V2.1_STABLE</div>
            </div>

            <div className="info-group">
                <div style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.1em' }}>LOCATION</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>CHENNAI, IND // 12.97° N</div>
            </div>

            <div className="info-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                    width: '32px',
                    height: '2px',
                    background: '#ccff00'
                }} />
                <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>SYSTEM_STATUS: ACTIVE</div>
            </div>

            <div style={{
                marginTop: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.5rem',
                fontSize: '0.55rem',
                opacity: 0.5,
                lineHeight: 1.4
            }}>
                INIT_SEQ: COMPLETED<br />
                USER: YUGA_ROOT<br />
                UPTIME: 99.98%
            </div>
        </div >
    );
};

export default memo(TechnicalInfoBox);
