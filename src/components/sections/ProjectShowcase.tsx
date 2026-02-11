import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import projectsData from '../../content/projects.json';
import graphicsData from '../../content/graphics.json';
import { ExternalLink, Github } from 'lucide-react';
import './ProjectShowcase.css';

interface ProjectItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    tech: string[];
    role: string;
    links: {
        demo?: string;
        repo?: string;
        pr?: string;
    };
    thumbnailPublicId?: string;
    type: 'project';
}

interface GraphicItem {
    id: string;
    title: string;
    description: string;
    imagePublicId: string;
    category: string;
    type: 'graphic';
}

type ShowcaseItem = ProjectItem | GraphicItem;

const ProjectShowcase = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState(0);
    const [scrollDistance, setScrollDistance] = useState(0);
    const rafRef = useRef<number>(0);

    const updateScrollDistance = useCallback(() => {
        if (!trackRef.current) return;
        setScrollDistance(Math.max(trackRef.current.scrollWidth - window.innerWidth, 0));
    }, []);

    useEffect(() => {
        updateScrollDistance();
        window.addEventListener('resize', updateScrollDistance);
        return () => window.removeEventListener('resize', updateScrollDistance);
    }, [updateScrollDistance]);

    useEffect(() => {
        // Recalculate after images load
        const images = trackRef.current?.querySelectorAll('img');
        if (!images) return;
        let loaded = 0;
        const total = images.length;
        const onLoad = () => {
            loaded++;
            if (loaded >= total) updateScrollDistance();
        };
        images.forEach(img => {
            if (img.complete) { loaded++; }
            else { img.addEventListener('load', onLoad, { once: true }); }
        });
        if (loaded >= total) updateScrollDistance();
    }, [updateScrollDistance]);

    useEffect(() => {
        if (window.innerWidth < 768 || scrollDistance <= 0) return;

        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const wrapper = wrapperRef.current;
                if (!wrapper) return;

                const rect = wrapper.getBoundingClientRect();
                const wrapperHeight = wrapper.offsetHeight;
                const scrollableRange = wrapperHeight - window.innerHeight;

                if (scrollableRange <= 0) return;

                // How far we've scrolled into the wrapper (0 at top, scrollableRange at bottom)
                const scrolled = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));

                setTranslateX(-progress * scrollDistance);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial calc

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scrollDistance]);

    const showcaseItems = useMemo(() => {
        const allItems: ShowcaseItem[] = [
            ...projectsData.map(p => ({ ...p, type: 'project' as const })),
            ...graphicsData.slice(0, 8).map(g => ({ ...g, type: 'graphic' as const }))
        ];
        return allItems.sort(() => Math.random() - 0.5);
    }, []);

    // Wrapper height = 100vh (sticky viewport) + scrollDistance (room to scroll through)
    const wrapperHeight = window.innerWidth >= 768 && scrollDistance > 0
        ? window.innerHeight + scrollDistance
        : undefined;

    return (
        <div
            ref={wrapperRef}
            className="showcase-wrapper"
            style={{ height: wrapperHeight }}
        >
            <div className="showcase-sticky">
                <div className="showcase-header">
                    <h2 className="showcase-title">
                        <span className="title-number">04</span>
                        PROJECT SHOWCASE
                    </h2>
                    <p className="showcase-subtitle">DEPLOYED BUILDS & CREATIVE WORKS</p>
                </div>

                <div
                    ref={trackRef}
                    className="showcase-scroll-container"
                    style={{ transform: `translateX(${translateX}px)` }}
                >
                    {showcaseItems.map((item) => (
                        item.type === 'project' ? (
                            <div
                                key={`project-${item.id}`}
                                className="showcase-card project-card"
                            >
                                {item.thumbnailPublicId && (
                                    <div className="card-image">
                                        <img
                                            src={item.thumbnailPublicId}
                                            alt={item.title}
                                            loading="lazy"
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
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-subtitle">{item.subtitle}</div>
                                    <p className="card-description">{item.description}</p>

                                    <div className="card-tech">
                                        {item.tech.slice(0, 4).map((tech: string, idx: number) => (
                                            <span key={idx} className="tech-tag">{tech}</span>
                                        ))}
                                        {item.tech.length > 4 && <span className="tech-tag">+{item.tech.length - 4}</span>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={`graphic-${item.id}`}
                                className="showcase-card graphic-card"
                            >
                                <div className="card-image">
                                    <img
                                        src={item.imagePublicId}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="card-content">
                                    <span className="category-badge">{item.category}</span>
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-description">{item.description}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                <div className="showcase-scroll-indicator">
                    <span>SCROLL HORIZONTALLY</span>
                    <div className="scroll-arrow">&rarr;</div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;
