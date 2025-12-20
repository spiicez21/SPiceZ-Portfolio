import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../../lib/animations/gsapClient';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { X } from 'lucide-react';
import './NavBar.css';

const navItems = [
    { label: 'WHOAMI', href: '/#whoami' },
    { label: 'STACK', href: '/#stack-trace' },
    { label: 'WORKS', href: '/#work-navigation' },
    { label: 'CERTS', href: '/#verified-credentials' },
    { label: 'CONTACT', href: '/#open-ticket' },
];

const NavBar = () => {
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
                setTimeout(() => {
                    window.dispatchEvent(new Event('triggerBootSequence'));
                }, 100);
            } else {
                window.dispatchEvent(new Event('triggerBootSequence'));
                if (lenis) lenis.scrollTo(0);
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
        <nav ref={navRef} className="navbar slim-sleek">
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


            {/* Right Module: Action & Menu */}
            <div className="nav-module nav-right">
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-action-btn"
                >
                    HIRE ME
                </a>

                <button
                    className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} color="#000" /> : <div className="menu-icon-bars"><span></span><span></span></div>}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="overlay-nav-items">
                    {navItems.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            className="overlay-link"
                            onClick={(e) => handleNavClick(e, item.href)}
                        >
                            <span className="link-num">0{idx + 1}</span>
                            <span className="link-text">{item.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
