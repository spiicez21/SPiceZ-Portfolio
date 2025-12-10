import SectionFrame from '../ui/SectionFrame';
import aboutData from '../../content/about.json';
import './WhoAmI.css';

const WhoAmI = () => {
    return (
        <SectionFrame id="whoami" label="WHOAMI" number="02">
            <div className="whoami-content">
                <div className="whoami-main">
                    <p className="whoami-intro">{aboutData.intro}</p>
                    {aboutData.paragraphs.map((para, idx) => (
                        <p key={idx} className="whoami-paragraph">{para}</p>
                    ))}
                </div>

                <div className="whoami-sidebar">
                    <div className="stats-box">
                        <div className="stats-header">QUICK STATS</div>
                        <div className="stats-grid">
                            {Object.entries(aboutData.stats).map(([key, value]) => (
                                <div key={key} className="stat-item">
                                    <div className="stat-key">{key.toUpperCase()}</div>
                                    <div className="stat-value">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SectionFrame>
    );
};

export default WhoAmI;
