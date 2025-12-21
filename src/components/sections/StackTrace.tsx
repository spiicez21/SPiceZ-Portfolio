import { type JSX, memo, useRef } from 'react';
import SectionFrame from '../ui/SectionFrame';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/animations/gsapClient';
import techStackData from '../../content/techstack.json';
import './StackTrace.css';
import {
    FaReact, FaNodeJs, FaPython, FaFigma, FaGitAlt, FaLinux, FaDocker,
} from 'react-icons/fa';
import {
    SiTypescript, SiTailwindcss, SiGreensock, SiVite, SiMongodb, SiPostgresql,
    SiAdobephotoshop, SiAdobeillustrator, SiAdobeaftereffects, SiKotlin, SiOracle
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

// Define a type for the icon map
type IconMapType = {
    [key: string]: JSX.Element;
};

// Map the tech stack names to their respective icons
const iconMap: IconMapType = {
    "React": <FaReact />,
    "TypeScript": <SiTypescript />,
    "Tailwind CSS": <SiTailwindcss />,
    "GSAP": <SiGreensock />,
    "Vite": <SiVite />,
    "Node.js": <FaNodeJs />,
    "Python": <FaPython />,
    "MongoDB": <SiMongodb />,
    "PostgreSQL": <SiPostgresql />,
    "Kotlin": <SiKotlin />,
    "Oracle APEX": <SiOracle />,
    "Figma": <FaFigma />,
    "Photoshop": <SiAdobephotoshop />,
    "Illustrator": <SiAdobeillustrator />,
    "After Effects": <SiAdobeaftereffects />,
    "Git": <FaGitAlt />,
    "VS Code": <VscVscode />,
    "Linux": <FaLinux />,
    "Docker": <FaDocker />,
};

const StackTrace = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const categories = containerRef.current.querySelectorAll('.category-section');

        // Animate each category section with scroll effects
        categories.forEach((category, idx) => {
            // MATRIX CASCADE - Drop from top like code rain
            gsap.fromTo(category,
                {
                    y: -200,
                    opacity: 0,
                    filter: "brightness(3) saturate(0)",
                    scale: 1.1
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "brightness(1) saturate(1)",
                    scale: 1,
                    duration: 1.4,
                    delay: idx * 0.2,
                    ease: "bounce.out",
                    scrollTrigger: {
                        trigger: category,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Parallax effect on scroll
            gsap.to(category, {
                y: -20,
                scrollTrigger: {
                    trigger: category,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1,
                }
            });

            // Animate category header
            const header = category.querySelector('.category-header');
            gsap.fromTo(header,
                {
                    opacity: 0,
                    x: -20
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: category,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate tech cards with stagger
            const cards = category.querySelectorAll('.tech-card');
            gsap.fromTo(cards,
                {
                    scale: 0,
                    opacity: 0,
                    y: 30,
                    rotateX: -90
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.6,
                    stagger: {
                        amount: 0.5,
                        from: "start",
                        ease: "power2.out"
                    },
                    ease: "back.out(1.3)",
                    scrollTrigger: {
                        trigger: category,
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Card hover scale animation
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        scale: 1.08,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        });

        // Animate the entire container on initial scroll
        gsap.fromTo(containerRef.current,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );

    }, { scope: containerRef });

    return (
        <SectionFrame id="stack-trace" label="STACK TRACE" number="03">
            <div className="stack-container" ref={containerRef}>
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="category-section">
                        <div className="category-header">
                            <div className="category-indicator"></div>
                            <span className="category-label">{category.label}</span>
                            <span className="category-count">{category.items.length}</span>
                        </div>
                        <div className="tech-grid">
                            {category.items.map((item, index) => (
                                <div key={index} className="tech-card">
                                    <div className="tech-icon">{iconMap[item]}</div>
                                    <div className="tech-name">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
});

export default StackTrace;
