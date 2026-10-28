import { ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaCoffee } from 'react-icons/fa';
import './FooterBar.css';

const FooterBar = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-bar" id="socials">
            <div className="site-footer__inner">
                <div className="site-footer__top">
                    <a className="site-footer__wordmark" href="#boot-sequence" aria-label="Back to top">SPICEZ<span>.</span></a>
                    <p>Built with curiosity, code, and a very full playlist.</p>
                    <a className="site-footer__email" href="mailto:yuga.bharathijai2106@gmail.com">
                        Let’s talk <ArrowUpRight size={16} />
                    </a>
                </div>
                <div className="site-footer__bottom">
                    <span>© {currentYear} Yugabharathi J</span>
                    <div className="site-footer__socials" aria-label="Social links">
                        <a href="https://github.com/Yugabharathi21" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                        <a href="https://linkedin.com/in/yugabharathij" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="https://instagram.com/_yuga_21_" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://www.buymeacoffee.com/yugabharathi" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee"><FaCoffee /></a>
                    </div>
                    <a href="#boot-sequence" className="site-footer__toplink">Back to top ↑</a>
                </div>
            </div>
        </footer>
    );
};

export default FooterBar;
