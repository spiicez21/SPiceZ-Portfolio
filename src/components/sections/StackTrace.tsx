import SectionFrame from '../ui/SectionFrame';
import techStackData from '../../content/techstack.json';
import './StackTrace.css';

const StackTrace = () => {
    return (
        <SectionFrame id="stack-trace" label="STACK TRACE" number="03">
            <div className="stack-trace-content">
                {techStackData.categories.map((category) => (
                    <div key={category.id} className="stack-category">
                        <div className="category-label">{category.label}</div>
                        <div className="category-items">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="stack-item">
                                    <span className="item-bullet">▸</span>
                                    <span className="item-text">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
};

export default StackTrace;
