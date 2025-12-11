import SectionFrame from '../ui/SectionFrame';
import AnimateIn from '../utils/AnimateIn';
import AsciiImage from '../utils/AsciiImage';
import graphicsData from '../../content/graphics.json';
import { useState } from 'react';
import { X } from 'lucide-react';
import './PixelLab.css';

const PixelLab = () => {
    const [selectedGraphic, setSelectedGraphic] = useState<typeof graphicsData[0] | null>(null);

    const openPreview = (graphic: typeof graphicsData[0]) => {
        setSelectedGraphic(graphic);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const closePreview = () => {
        setSelectedGraphic(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <SectionFrame id="pixel-lab" label="PIXEL LAB" number="05">
            <AnimateIn className="graphics-grid" animation="fade-up" stagger={0.1}>
                {graphicsData.map((graphic) => (
                    <div
                        key={graphic.id}
                        className="graphic-card"
                        onClick={() => openPreview(graphic)}
                    >
                        <div className="graphic-image">
                            <AsciiImage
                                src={graphic.imagePublicId}
                                alt={graphic.title}
                                className="w-full h-full"
                                density={6}
                            />
                        </div>
                        <div className="graphic-info">
                            <div className="graphic-header">
                                <h3 className="graphic-title">{graphic.title}</h3>
                                <span className="graphic-category">{graphic.category}</span>
                            </div>
                            <p className="graphic-description">{graphic.description}</p>
                        </div>
                    </div>
                ))}
            </AnimateIn>

            {selectedGraphic && (
                <div className="graphic-preview-overlay" onClick={closePreview}>
                    <div className="graphic-preview-content" onClick={(e) => e.stopPropagation()}>
                        <button className="preview-close-btn" onClick={closePreview} aria-label="Close preview">
                            <X size={24} />
                        </button>

                        <div className="preview-image-container">
                            <img
                                src={selectedGraphic.imagePublicId}
                                alt={selectedGraphic.title}
                            />
                        </div>

                        <div className="preview-info">
                            <div className="preview-header">
                                <h3 className="preview-title">{selectedGraphic.title}</h3>
                                <span className="preview-category">{selectedGraphic.category}</span>
                            </div>
                            <p className="preview-description">{selectedGraphic.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </SectionFrame>
    );
};

export default PixelLab;
