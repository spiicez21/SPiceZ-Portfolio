import MalakEasterEgg from '../ui/MalakEasterEgg';
import F1Telemetry from '../ui/F1Telemetry';
import './FooterBar.css';

const FooterBar = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-bar">
            <MalakEasterEgg />

            <div className="footer-big-text">
                YUGA BHARATHI
            </div>

            <F1Telemetry />

            <div className="footer-content">
                <div className="footer-text">
                    {'>'} last updated: {currentYear} | built with Ctrl+C / Ctrl+V and caffeine ☕
                </div>
                <div className="footer-text">
                    © {currentYear} YUGA BHARATHI — Yugabharathi J
                </div>
            </div>
        </footer>
    );
};

export default FooterBar;
