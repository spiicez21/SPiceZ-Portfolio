
import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './NavBar.css';

const navItems = [
    { label: 'BOOT', href: '#boot-sequence' },
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

    return (
        <nav ref={navRef} className="navbar">
            <div className="navbar-content">
                <a href="#boot-sequence" className="navbar-logo">
                    <img src="/Logo/SPiceZ.png" alt="SPiceZ" className="logo-image" />
                </a>

                <div className="navbar-links">
                    {navItems.map((item, idx) => (
                        <a key={idx} href={item.href} className="nav-link">
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

