import SectionFrame from '../ui/SectionFrame';
import graphicsData from '../../content/graphics.json';
import './PixelLab.css';

const PixelLab = () => {
    return (
        <SectionFrame id="pixel-lab" label="PIXEL LAB" number="05">
            <div className="graphics-grid">
                {graphicsData.map((graphic) => (
                    <div key={graphic.id} className="graphic-card">
                        <div className="graphic-image">
                            <img
                                src={graphic.imagePublicId}
                                alt={graphic.title}
                                loading="lazy"
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
            </div>
        </SectionFrame>
    );
};

export default PixelLab;
