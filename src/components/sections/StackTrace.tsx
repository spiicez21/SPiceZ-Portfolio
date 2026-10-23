import { type JSX, memo } from 'react';
import SectionFrame from '../ui/SectionFrame';
import techStackData from '../../content/techstack.json';
import './StackTrace.css';
import {
    FaReact, FaNodeJs, FaPython, FaFigma, FaGitAlt, FaLinux, FaDocker,
} from 'react-icons/fa';
import {
    SiTypescript, SiTailwindcss, SiGreensock, SiVite, SiMongodb, SiPostgresql,
    SiAdobephotoshop, SiAdobeillustrator, SiAdobeaftereffects, SiKotlin, SiOracle,
    SiJenkins, SiGooglecloud
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';

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
    "Jenkins": <SiJenkins />,
    "AWS": <FaAws />,
    "GCP": <SiGooglecloud />,
};



const StackTrace = memo(() => {
    return (
        <SectionFrame
            id="stack-trace"
            label="TOOLKIT"
            number="05"
        >
            <div className="stack-container">
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="tech-category">
                        <h3 className="category-title">{category.label}</h3>
                        <div className="tech-grid">
                            {category.items.map((item) => (
                                <span key={item} className="tech-pill">
                                    <span className="tech-pill__icon" aria-hidden="true">{iconMap[item]}</span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
});

export default StackTrace;
