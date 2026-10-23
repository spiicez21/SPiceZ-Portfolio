import { memo } from 'react';
import './HeroPortrait.css';

const HeroPortrait = memo(() => {
    return (
        <div className="portrait-container">
            <div className="portrait-inner-wrapper">
                <img
                    src="/images/portrait/yuga.webp"
                    alt="Hero Portrait"
                    className="hero-main-image"
                    decoding="async"
                    fetchPriority="high"
                />
            </div>
        </div>
    );
});

export default HeroPortrait;
