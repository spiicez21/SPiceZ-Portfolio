import { FaGithub, FaLinkedin, FaInstagram, FaCoffee } from 'react-icons/fa';
import F1Telemetry from '../ui/F1Telemetry';
import SpotifyBadge from '../ui/SpotifyBadge';
import './FooterBar.css';

const FooterBar = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-bar">
            {/* SIGNAL CHANNEL BAR */}
            <div className="footer-signals">
                <div className="signal-group">
                    <span className="signal-header">SIGNAL CHANNEL</span>
                    <span className="signal-status">Initiate direct communication protocol.</span>
                </div>

                <div className="signal-links">
                    <a href="https://github.com/Yugabharathi21" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                    <a href="https://linkedin.com/in/yugabharathij" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    <a href="https://instagram.com/_yuga_21_" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://www.buymeacoffee.com/yugabharathi" target="_blank" rel="noopener noreferrer"><FaCoffee /></a>
                </div>

                <div className="signal-direct">
                    <span className="direct-label">DIRECT LINK://</span>
                    <a href="mailto:yugab.bharathijai210@gmail.com" className="direct-email">
                        yugab.bharathijai210@gmail.com
                    </a>
                </div>
            </div>

            <div className="footer-big-text">
                YUGA BHARATHI
            </div>

            <SpotifyBadge />

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
