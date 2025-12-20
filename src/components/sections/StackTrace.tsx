import { type JSX, memo } from 'react';
import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
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
    return (
        <SectionFrame id="stack-trace" label="STACK TRACE" number="03">
            <AnimateIn className="dashboard-grid" animation="fade-up" stagger={0.05} threshold={0.1}>
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="sys-module">
                        <div className="sys-header">
                            <span className="sys-title">{category.label.toUpperCase()}</span>
                            <span className="sys-id">SYS.{category.id.substring(0, 3).toUpperCase()}.01</span>
                        </div>
                        <div className="sys-content">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="tech-chip">
                                    <span className="chip-icon">{iconMap[item] || "•"}</span>
                                    <span className="chip-label">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="sys-footer">
                            <div className="sys-bar"></div>
                            <span className="sys-status">ACTIVE</span>
                        </div>
                    </div>
                ))}
            </AnimateIn>
        </SectionFrame>
    );
});

export default StackTrace;
