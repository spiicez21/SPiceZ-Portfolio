import MalakEasterEgg from '../ui/MalakEasterEgg';
import './FooterBar.css';

const FooterBar = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-bar">
            <MalakEasterEgg />
            <div className="footer-content">
                <div className="footer-text">
                    {'>'} last updated: {currentYear} | built with Ctrl+C / Ctrl+V and caffeine ☕
                </div>
                <div className="footer-text">
                    © {currentYear} SPiceZ — Yugabharathi J
                </div>
            </div>
        </footer>
    );
};

export default FooterBar;
