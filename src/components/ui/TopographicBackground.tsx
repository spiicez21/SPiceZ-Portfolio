import { memo } from 'react';

const TopographicBackground = () => {
    return (
        <div className="topographic-bg" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'hidden',
            background: '#000'
        }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 1000"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    opacity: 0.1,
                    filter: 'contrast(1.2)'
                }}
            >
                <g fill="none" stroke="#FFFFFF" strokeWidth="0.5">
                    <path d="M-100,200 Q150,100 400,200 T900,200" />
                    <path d="M-100,300 Q200,150 500,300 T1100,300" />
                    <path d="M-100,450 Q250,300 600,450 T1300,450" />
                    <path d="M-100,600 Q300,450 700,600 T1500,600" />
                    <path d="M-100,750 Q350,600 800,750 T1700,750" />

                    <path d="M200,1100 Q100,850 200,600 T200,-100" />
                    <path d="M400,1100 Q300,750 400,400 T400,-100" />
                    <path d="M600,1100 Q500,650 600,200 T600,-100" />
                    <path d="M800,1100 Q700,550 800,0 T800,-100" />
                </g>

                {/* Additional sinuous details */}
                <path d="M100,100 C300,200 100,400 300,500 S100,800 300,900"
                    fill="none" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.5" />
                <path d="M700,100 C900,200 700,400 900,500 S700,800 900,900"
                    fill="none" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.5" />
            </svg>

            {/* Vignette Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)'
            }} />
        </div>
    );
};

export default memo(TopographicBackground);
