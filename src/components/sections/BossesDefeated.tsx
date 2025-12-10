import SectionFrame from '../ui/SectionFrame';
import hackathonsData from '../../content/hackathons.json';
import './BossesDefeated.css';

const BossesDefeated = () => {
    return (
        <SectionFrame id="bosses-defeated" label="BOSSES DEFEATED" number="08">
            <div className="hackathons-grid">
                {hackathonsData.map((hack) => (
                    <div key={hack.id} className="hack-card">
                        <div className="hack-badge">{hack.position}</div>
                        <h3 className="hack-event">{hack.event}</h3>
                        <h4 className="hack-project">{hack.project}</h4>
                        <p className="hack-description">{hack.description}</p>
                        <div className="hack-team">
                            <span className="team-label">TEAM:</span>
                            <span className="team-name">{hack.team}</span>
                        </div>
                    </div>
                ))}
            </div>
        </SectionFrame>
    );
};

export default BossesDefeated;
