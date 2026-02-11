import { useState } from 'react';
import graphicsData from '../../content/graphics.json';
import { X } from 'lucide-react';
import './CreativeShowcase.css';

// Seeded random for deterministic layout
function seededRandom(seed: number) {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
}

// Size variation — some cards are tall (span 2 rows)
function getGridLayout(index: number) {
    // Make specific cards large for visual variety
    // Indices: 1, 4, 8, 13, 18 — spread across the grid
    const largeIndices = [1, 4, 8, 13, 18];
    const isLarge = largeIndices.includes(index);

    return { isLarge };
}

const INITIAL_COUNT = 9;

const CreativeShowcase = () => {
    const [selectedGraphic, setSelectedGraphic] = useState<typeof graphicsData[0] | null>(null);
    const [showAll, setShowAll] = useState(false);

    const visibleItems = showAll ? graphicsData : graphicsData.slice(0, INITIAL_COUNT);
    const hasMore = graphicsData.length > INITIAL_COUNT;

    const openPreview = (graphic: typeof graphicsData[0]) => {
        setSelectedGraphic(graphic);
        document.body.style.overflow = 'hidden';
    };

    const closePreview = () => {
        setSelectedGraphic(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <section className="creative-section">
            <div className="creative-header">
                <h2 className="creative-title">
                    <span className="creative-number">05</span>
                    PIXEL LAB
                </h2>
                <p className="creative-subtitle">GRAPHICS · THUMBNAILS · LOGOS · POSTERS</p>
            </div>

            <div className="creative-grid">
                {visibleItems.map((graphic, index) => {
                    const layout = getGridLayout(index);

                    return (
                        <div
                            key={graphic.id}
                            className={`creative-card ${layout.isLarge ? 'creative-card--large' : ''}`}
                            onClick={() => openPreview(graphic)}
                        >
                            <div className="creative-card__image">
                                <img
                                    src={graphic.imagePublicId}
                                    alt={graphic.title}
                                    loading="lazy"
                                />
                            </div>
                            <div className="creative-card__info">
                                <span className="creative-card__title">{graphic.title}</span>
                                <span className="creative-card__category">{graphic.category}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="creative-show-more">
                    <button
                        className="creative-show-more__btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'SHOW LESS' : `SHOW MORE (${graphicsData.length - INITIAL_COUNT}+)`}
                    </button>
                </div>
            )}

            {/* Lightbox modal */}
            {selectedGraphic && (
                <div className="creative-lightbox" onClick={closePreview}>
                    <div className="creative-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <div className="creative-lightbox__image-box">
                            <img
                                src={selectedGraphic.imagePublicId}
                                alt={selectedGraphic.title}
                            />
                            <button className="creative-lightbox__close" onClick={closePreview}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="creative-lightbox__meta">
                            <h3>{selectedGraphic.title}</h3>
                            <span className="creative-lightbox__badge">{selectedGraphic.category}</span>
                            <p>{selectedGraphic.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CreativeShowcase;
