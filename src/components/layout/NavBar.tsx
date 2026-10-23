import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../../lib/animations/gsapClient';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { Minus } from 'lucide-react';
import './NavBar.css';

const navItems = [
    { label: 'WORK', href: '/#projects' },
    { label: 'CREATIVE', href: '/#pixel-lab' },
    { label: 'ABOUT', href: '/#whoami' },
    { label: 'MILESTONES', href: '/#bosses-defeated' },
    { label: 'CONTACT', href: '/#open-ticket' },
];

interface NavBarProps {
    className?: string;
}

const NavBar = ({ className = '' }: NavBarProps) => {
    const navRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lenis = useSmoothScroll();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!navRef.current) return;

        gsap.fromTo(navRef.current,
            {
                opacity: 0,
                y: -20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power2.out',
            }
        );
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMenuOpen(false);

        if (href === '#boot-sequence' || href === '/#boot-sequence') {
            if (location.pathname !== '/') {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                if (lenis) lenis.scrollTo(0);
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        if (href.startsWith('/#')) {
            const targetId = href.replace('/#', '#');
            if (location.pathname !== '/') {
                navigate('/');
                // Wait for navigation then scroll
                setTimeout(() => {
                    if (lenis) lenis.scrollTo(targetId);
                    else {
                        const element = document.getElementById(targetId.replace('#', ''));
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500); // adjust delay
            } else {
                if (lenis) lenis.scrollTo(targetId);
                else {
                    const element = document.getElementById(targetId.replace('#', ''));
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (href.startsWith('/')) {
            navigate(href);
            // Scroll to top on new page
            window.scrollTo(0, 0);
        } else if (href.startsWith('#')) {
            // Fallback for local hashes if any
            if (lenis) lenis.scrollTo(href);
            else {
                const element = document.getElementById(href.replace('#', ''));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav ref={navRef} className={`navbar slim-sleek ${className}`}>
            {/* Left Module: Name */}
            <div className="nav-module nav-left">
                <a
                    href="#boot-sequence"
                    className="navbar-brand-text"
                    onClick={(e) => handleNavClick(e, '#boot-sequence')}
                >
                    <span className="brand-firstname">YUGA</span>
                    <span className="brand-lastname">BHARATHI</span>
                </a>
            </div>

            <div className="nav-primary" aria-label="Main navigation">
                <a href="/#projects" onClick={(e) => handleNavClick(e, '/#projects')}>Work</a>
                <a href="/#pixel-lab" onClick={(e) => handleNavClick(e, '/#pixel-lab')}>Creative</a>
                <a href="/#whoami" onClick={(e) => handleNavClick(e, '/#whoami')}>About</a>
                <a href="/#bosses-defeated" onClick={(e) => handleNavClick(e, '/#bosses-defeated')}>Milestones</a>
                <a href="/#open-ticket" onClick={(e) => handleNavClick(e, '/#open-ticket')}>Contact</a>
            </div>


            {/* Right Module: Action & Menu */}
            <div className="nav-module nav-right">
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-action-btn"
                >
                    RESUME
                </a>

                <button
                    className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <Minus size={24} color="#000" /> : <div className="menu-icon-bars"><span></span><span></span></div>}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <button
                    className="overlay-close-btn"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <Minus size={28} strokeWidth={3} />
                </button>
                <div className="overlay-nav-items">
                    {navItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="nav-item-wrapper"
                        >
                            <a
                                href={item.href}
                                className="overlay-link"
                                onClick={(e) => handleNavClick(e, item.href)}
                            >
                                <span className="link-num">0{idx + 1}</span>
                                <span className="link-text">{item.label}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
