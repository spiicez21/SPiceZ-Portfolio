import './HeroPortrait.css';

export default function HeroPortrait() {
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
}
