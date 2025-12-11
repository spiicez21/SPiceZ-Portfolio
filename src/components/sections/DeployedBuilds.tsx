import AnimateIn from '../utils/AnimateIn';
import SectionFrame from '../ui/SectionFrame';
import InkButton from '../ui/InkButton';
import projectsData from '../../content/projects.json';
import { ExternalLink, Github } from 'lucide-react';
import './DeployedBuilds.css';

const DeployedBuilds = () => {
    return (
        <SectionFrame id="deployed-builds" label="DEPLOYED BUILDS" number="04">
            <AnimateIn
                className="projects-grid"
                animation="fade-up"
                stagger={0.2}
                duration={0.8}
                threshold={0.1}
            >
                {projectsData.map((project) => (
                    <div key={project.id} className="project-card">
                        {project.thumbnailPublicId && (
                            <div className="project-image">
                                <img
                                    src={project.thumbnailPublicId}
                                    alt={project.title}
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="project-header">
                            <h3 className="project-title">{project.title}</h3>
                            <div className="project-links">
                                {project.links.repo && project.links.repo !== '#' && (
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
                                {project.links.demo && project.links.demo !== '#' && (
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

                        {project.links.demo && project.links.demo !== '#' && (
                            <div className="project-actions">
                                <InkButton href={project.links.demo} variant="primary">
                                    View Build
                                </InkButton>
                            </div>
                        )}
                    </div>
                ))}
            </AnimateIn>
        </SectionFrame>
    );
};

export default DeployedBuilds;
