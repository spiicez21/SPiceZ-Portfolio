import type { JSX } from 'react';
import SectionFrame from '../ui/SectionFrame';
import techStackData from '../../content/techstack.json';
import AnimateIn from '../utils/AnimateIn';
import './StackTrace.css';
import {
    FaReact, FaNodeJs, FaPython, FaFigma, FaGitAlt, FaLinux, FaDocker,
} from 'react-icons/fa'; // Font Awesome
import {
    SiTypescript, SiTailwindcss, SiGreensock, SiVite, SiMongodb, SiPostgresql,
    SiAdobephotoshop, SiAdobeillustrator, SiAdobeaftereffects
} from 'react-icons/si'; // Simple Icons
import { VscVscode } from 'react-icons/vsc'; // VS Code Icons

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
    "Figma": <FaFigma />,
    "Photoshop": <SiAdobephotoshop />,
    "Illustrator": <SiAdobeillustrator />,
    "After Effects": <SiAdobeaftereffects />,
    "Git": <FaGitAlt />,
    "VS Code": <VscVscode />,
    "Linux": <FaLinux />,
    "Docker": <FaDocker />,
};

const StackTrace = () => {
    return (
        <SectionFrame id="stack-trace" label="STACK TRACE" number="03">
            <div className="stack-trace-container">
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="stack-category-group">
                        <AnimateIn animation="fade-in" duration={0.5}>
                            <h3 className="category-header">{category.label}</h3>
                        </AnimateIn>
                        <AnimateIn
                            className="stack-grid"
                            animation="3d-flip"
                            stagger={0.05}
                            duration={0.6}
                            threshold={0.1}
                        >
                            {category.items.map((item, idx) => (
                                <div key={idx} className="tech-card">
                                    <div className="icon-wrapper">
                                        {iconMap[item] || <span className="default-icon">▸</span>}
                                    </div>
                                    <span className="tech-name">{item}</span>
                                </div>
                            ))}
                        </AnimateIn>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
};

export default StackTrace;
