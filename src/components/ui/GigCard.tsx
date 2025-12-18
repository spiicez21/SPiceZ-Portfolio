import './GigCard.css';

const GigCard = () => {
    return (
        <div className="gig-card">
            <div className="gig-header">
                <span className="gig-title">Freelance Gigs</span>
                <div className="gig-status">
                    <span className="status-dot"></span>
                    OPEN
                </div>
            </div>
            <div className="gig-list">
                <div className="gig-item">
                    <span className="arrow">{'>'}</span> UI/UX Designs
                </div>
                <div className="gig-item">
                    <span className="arrow">{'>'}</span> Full Stack Projects
                </div>
                <div className="gig-item">
                    <span className="arrow">{'>'}</span> Youtube Channel Assets
                </div>
                <div className="gig-item">
                    <span className="arrow">{'>'}</span> AI/ML Projects
                </div>
            </div>
        </div>
    );
};

export default GigCard;
