import { type JSX, memo, useRef, useState } from 'react';
import SectionFrame from '../ui/SectionFrame';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/animations/gsapClient';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger);

// Define types
type IconMapType = {
    [key: string]: JSX.Element;
};

type TechItem = {
    name: string;
    category: string;
    position: { x: number; y: number };
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

// Predefined random positions for consistent layout
const generatePositions = (): TechItem[] => {
    const positions: TechItem[] = [];
    let xOffset = 5;

    techStackData.categories.forEach((category) => {
        category.items.forEach((item) => {
            // Distribute items across horizontal space with some randomness
            const x = xOffset + (Math.random() * 8);
            const y = 20 + (Math.random() * 55); // Random Y between 20% and 75%

            positions.push({
                name: item,
                category: category.label,
                position: { x, y }
            });

            xOffset += 6; // Closer spacing horizontally
        });
    });

    return positions;
};

const StackTrace = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);
    const [techItems] = useState<TechItem[]>(generatePositions());

    useGSAP(() => {
        if (!containerRef.current || !scrollContainerRef.current) return;

        // Horizontal scroll animation
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;

        gsap.to(scrollContainerRef.current, {
            x: -(scrollWidth - viewportWidth),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            }
        });

        // Animate logos on scroll
        const logos = scrollContainerRef.current.querySelectorAll('.tech-logo');
        logos.forEach((logo, index) => {
            gsap.fromTo(logo,
                {
                    scale: 0,
                    opacity: 0,
                    rotation: -180
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef, dependencies: [techItems] });

    return (
        <SectionFrame id="stack-trace" label="STACK TRACE" number="03">
            <div className="stack-wrapper" ref={containerRef}>
                <div className="stack-scroll-container" ref={scrollContainerRef}>
                    {techItems.map((tech, index) => (
                        <div
                            key={index}
                            className="tech-logo"
                            style={{
                                left: `${tech.position.x}%`,
                                top: `${tech.position.y}%`
                            }}
                            onMouseEnter={() => setHoveredTech(tech.name)}
                            onMouseLeave={() => setHoveredTech(null)}
                        >
                            <div className="tech-icon-scattered">
                                {iconMap[tech.name]}
                            </div>

                            <div className={`hover-card ${hoveredTech === tech.name ? 'active' : ''}`}>
                                <div className="hover-card-name">{tech.name}</div>
                                <div className="hover-card-category">{tech.category}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionFrame>
    );
});

export default StackTrace;
