import { memo } from 'react';
import './HeroPortrait.css';

const HeroPortrait = memo(() => {
    return (
        <div className="portrait-container">
            <div className="portrait-inner-wrapper">
                <img
                    src="/Picture/normal-main.png"
                    alt="Hero Portrait"
                    className="hero-main-image"
                />
            </div>
        </div>
    );
});

export default HeroPortrait;
