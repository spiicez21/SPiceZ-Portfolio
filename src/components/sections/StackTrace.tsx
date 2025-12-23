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
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Animate logos on initial view
        const logos = containerRef.current.querySelectorAll('.tech-logo');
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

    }, { scope: containerRef });

    return (
        <SectionFrame
            id="stack-trace"
            label="STACK TRACE"
            number="03"
        >
            <div className="stack-container" ref={containerRef}>
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="tech-category">
                        <h3 className="category-title">{category.label}</h3>
                        <div className="tech-grid">
                            {category.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="tech-logo"
                                    onMouseEnter={() => setHoveredTech(item)}
                                    onMouseLeave={() => setHoveredTech(null)}
                                >
                                    <div className="tech-icon-scattered">
                                        {iconMap[item]}
                                    </div>

                                    <div className={`hover-card ${hoveredTech === item ? 'active' : ''}`}>
                                        <div className="hover-card-name">{item}</div>
                                        <div className="hover-card-category">{category.label}</div>
                                    </div>
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
