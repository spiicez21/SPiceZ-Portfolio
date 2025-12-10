import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/animations/gsapClient';
import SectionFrame from '../ui/SectionFrame';
import InkButton from '../ui/InkButton';
import projectsData from '../../content/projects.json';
import { ExternalLink, Github } from 'lucide-react';
import './DeployedBuilds.css';

const DeployedBuilds = () => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const cards = gridRef.current.querySelectorAll('.project-card');

        gsap.from(cards, {
            scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out',
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <SectionFrame id="deployed-builds" label="DEPLOYED BUILDS" number="04">
            <div ref={gridRef} className="projects-grid">
                {projectsData.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-header">
                            <h3 className="project-title">{project.title}</h3>
                            <div className="project-links">
                                {project.links.repo && (
                                    <a
                                        href={project.links.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-icon-link"
                                        aria-label="View code"
                                    >
                                        <Github size={20} />
                                    </a>
                                )}
                                {project.links.demo && (
                                    <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-icon-link"
                                        aria-label="View demo"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="project-subtitle">{project.subtitle}</div>
                        <p className="project-description">{project.description}</p>

                        <div className="project-tech">
                            {project.tech.map((tech, idx) => (
                                <span key={idx} className="tech-tag">{tech}</span>
                            ))}
                        </div>

                        <div className="project-role">
                            <span className="role-label">ROLE:</span> {project.role}
                        </div>

                        <div className="project-actions">
                            {project.links.demo && (
                                <InkButton href={project.links.demo} variant="primary">
                                    View Build
                                </InkButton>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
};

export default DeployedBuilds;
