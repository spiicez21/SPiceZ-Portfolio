import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../../lib/animations/gsapClient';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { Menu, X } from 'lucide-react';
import './NavBar.css';

const navItems = [
    { label: 'WHOAMI', href: '/#whoami' },
    { label: 'STACK', href: '/#stack-trace' },
    { label: 'WORKS', href: '/#work-navigation' },
    { label: 'CERTS', href: '/#verified-credentials' },
    { label: 'WINS', href: '/#bosses-defeated' },
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
