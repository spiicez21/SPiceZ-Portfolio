import { useState } from 'react';
import projectsData from '../../content/projects.json';
import { ExternalLink, Github } from 'lucide-react';
import './ProjectShowcase.css';

const INITIAL_COUNT = 6;

const ProjectShowcase = () => {
    const [expanded, setExpanded] = useState(false);

    // Newest first, stable order. The old version shuffled on every mount and
    // scattered cards with seeded random offsets, so the section never looked
    // the same twice and nothing could be scanned in order.
    const items = [...projectsData].reverse();
    const visible = expanded ? items : items.slice(0, INITIAL_COUNT);
    const hidden = items.length - visible.length;

    return (
        <section className="showcase" id="projects">
            <header className="showcase-header">
                <h2 className="showcase-title">
                    <span className="title-number">01</span>
                    SELECTED WORK
                </h2>
                <p className="showcase-subtitle">
                    WEB PROJECTS, TOOLS &amp; EXPERIMENTS
                    <span className="showcase-count">{items.length} TOTAL</span>
                </p>
            </header>

            <div className="showcase-grid">
                {visible.map((item, index) => (
                    <article key={item.id} className={`project-card${index === 0 ? ' project-card--feature' : ''}`}>
                        {item.thumbnailPublicId && (
                            <div className="card-image">
                                <img
                                    loading="lazy"
                                    decoding="async"
                                    src={item.thumbnailPublicId}
                                    alt={item.title}
                                />
                            </div>
                        )}

                        <div className="card-content">
                            <div className="card-header">
                                <h3 className="card-title">{item.title}</h3>
                                <div className="card-links">
                                    {item.links.repo && item.links.repo !== '#' && (
                                        <a
                                            href={item.links.repo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="card-icon-link"
                                            aria-label={`${item.title} source code`}
                                        >
                                            <Github size={18} />
                                        </a>
                                    )}
                                    {item.links.demo && item.links.demo !== '#' && (
                                        <a
                                            href={item.links.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="card-icon-link"
                                            aria-label={`${item.title} live demo`}
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="card-subtitle">{item.subtitle}</div>
                            <p className="card-description">{item.description}</p>

                            <div className="card-tech">
                                {item.tech.slice(0, 4).map((tech: string) => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                                {item.tech.length > 4 && (
                                    <span className="tech-tag tech-tag--more">+{item.tech.length - 4}</span>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {items.length > INITIAL_COUNT && (
                <div className="showcase-actions">
                    <button
                        type="button"
                        className="showcase-toggle"
                        onClick={() => setExpanded((v) => !v)}
                    >
                        {expanded ? 'SHOW LESS' : `SHOW ${hidden} MORE`}
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProjectShowcase;
