import { useRef } from 'react';
import SectionFrame from '../ui/SectionFrame';
import aboutData from '../../content/about.json';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/animations/gsapClient';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BubbleText } from '../ui/BubbleText';
import './WhoAmI.css';

// Keywords to highlight - easily adjustable
const KEYWORDS = [
    "Computer Science", "building things", "debugging", "3 AM",
    "designing graphics", "hackathons", "learning by doing",
    "robust", "scalable", "full-stack", "creativity"
];

const WhoAmI = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        });

        tl.fromTo(".identity-terminal",
            {
                scale: 0.95,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "power4.out"
            }
        );
    }, { scope: containerRef });

    // Helper to separate keywords from normal text
    const renderWithHighlights = (text: string) => {
        // Split by keywords (keeping delimiters)
        const regex = new RegExp(`(${KEYWORDS.join('|')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            // Check if this part matches a keyword
            const isKeyword = KEYWORDS.some(k => k.toLowerCase() === part.toLowerCase());

            if (isKeyword) {
                return <BubbleText key={index} text={part} className="font-bold text-white" />;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <SectionFrame id="whoami" label="" number="">
            <div className="whoami-container" ref={containerRef}>
                <div className="identity-terminal">
                    {/* Terminal Header */}
                    <div className="terminal-header">
                        <div className="terminal-controls">
                            <div className="control close"></div>
                            <div className="control minimize"></div>
                            <div className="control maximize"></div>
                        </div>
                        <div className="terminal-title">user_identity.json</div>
                        <div className="terminal-spacer" style={{ width: 50 }}></div>
                    </div>

                    {/* Terminal Body */}
                    <div className="terminal-body">
                        {/* Left: Bio Text */}
                        <div className="bio-section">
                            {aboutData.paragraphs.map((para, idx) => (
                                <p key={idx} className="bio-para">
                                    {renderWithHighlights(para)}
                                </p>
                            ))}
                        </div>

                        {/* Right: Stats Sidebar */}
                        <div className="stats-sidebar">
                            <div className="sidebar-block">
                                <h3>SYSTEM SPECS</h3>
                                {Object.entries(aboutData.stats).map(([key, value]) => (
                                    <div key={key} className="stat-row">
                                        <span className="label">{key.toUpperCase()}</span>
                                        <span className="value">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="location-block">
                                <FaMapMarkerAlt className="icon" />
                                <span>Erode, TamilNadu</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionFrame>
    );
};

export default WhoAmI;
