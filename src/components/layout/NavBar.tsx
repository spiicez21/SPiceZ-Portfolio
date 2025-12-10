import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { Menu, X } from 'lucide-react';
import './NavBar.css';

const navItems = [
    { label: 'WHOAMI', href: '#whoami' },
    { label: 'STACK', href: '#stack-trace' },
    { label: 'BUILDS', href: '#deployed-builds' },
    { label: 'GRAPHICS', href: '#pixel-lab' },
    { label: 'WIP', href: '#in-progress' },
    { label: 'CERTS', href: '#verified-credentials' },
    { label: 'WINS', href: '#bosses-defeated' },
    { label: 'CONTACT', href: '#open-ticket' },
];

const NavBar = () => {
    const navRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lenis = useSmoothScroll();

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

        // Close menu if open
        setIsMenuOpen(false);

        // Handle boot sequence trigger if it's the logo
        if (href === '#boot-sequence') {
            window.dispatchEvent(new Event('triggerBootSequence'));
            if (lenis) lenis.scrollTo(0);
            return;
        }

        if (lenis) {
            lenis.scrollTo(href);
        } else {
            // Fallback if lenis is not ready
            const targetId = href.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav ref={navRef} className="navbar">
            <div className="navbar-content">
                <a
                    href="#boot-sequence"
                    className="navbar-logo"
                    onClick={(e) => handleNavClick(e, '#boot-sequence')}
                >
                    <img src="/Logo/SPiceZ.png" alt="SPiceZ" className="logo-image" />
                </a>

                {/* Desktop Menu */}
                <div className="navbar-links">
                    {navItems.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, item.href)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                {navItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="nav-link"
                        onClick={(e) => handleNavClick(e, item.href)}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default NavBar;
