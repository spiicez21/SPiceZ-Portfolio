import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import projectsData from '../../content/projects.json';
import { ExternalLink, Github } from 'lucide-react';
import './ProjectShowcase.css';

// Seeded random for deterministic layout
function seededRandom(seed: number) {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
}

// Pre-defined zigzag layout slots
// Each slot: { top: %, scale, marginLeft offset }
function getCardLayout(index: number, total: number) {
    const seed = index + 1;

    // Zigzag: alternate between top-heavy and bottom-heavy positions
    const isEven = index % 2 === 0;

    // Top position: zigzag between upper and lower region
    // Values are in px offset from top of the usable area (after track padding)
    const baseTop = isEven
        ? seededRandom(seed * 3) * 30          // 0–30px from content top
        : 200 + seededRandom(seed * 7) * 120;  // 200–320px from content top

    // Size variation: 3 tiers (small, medium, large)
    const sizeCategory = index % 3;
    const scale = sizeCategory === 0 ? 1.15 : sizeCategory === 1 ? 0.85 : 1.0;

    // Horizontal spacing: slight random offset to avoid grid feel
    const marginOffset = seededRandom(seed * 13) * 60 - 30; // -30 to +30px

    return { top: baseTop, scale, marginOffset };
}

const ProjectShowcase = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState(0);
    const [scrollDistance, setScrollDistance] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
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

                const scrolled = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));

                setTranslateX(-progress * scrollDistance);
                setScrollProgress(progress);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scrollDistance]);

    const showcaseItems = useMemo(() => {
        return [...projectsData].sort(() => Math.random() - 0.5);
    }, []);

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
                <div
                    className="showcase-header"
                    style={{
                        opacity: Math.max(0, 1 - scrollProgress * 10),
                        pointerEvents: scrollProgress > 0.05 ? 'none' : 'auto',
                    }}
                >
                    <h2 className="showcase-title">
                        <span className="title-number">04</span>
                        PROJECT SHOWCASE
                    </h2>
                    <p className="showcase-subtitle">DEPLOYED BUILDS & CREATIVE WORKS</p>
                </div>

                <div
                    ref={trackRef}
                    className="showcase-track"
                    style={{ transform: `translateX(${translateX}px)` }}
                >
                    {showcaseItems.map((item, index) => {
                        const layout = getCardLayout(index, showcaseItems.length);
                        const cardStyle: React.CSSProperties = {
                            marginTop: `${layout.top}px`,
                            transform: `scale(${layout.scale})`,
                            marginLeft: `${layout.marginOffset}px`,
                        };

                        return (
                            <div
                                key={`project-${item.id}`}
                                className="showcase-card project-card"
                                style={cardStyle}
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
                        );
                    })}
                </div>

                <div className="showcase-scroll-indicator">
                    <span>SCROLL</span>
                    <div className="scroll-arrow">&rarr;</div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;
