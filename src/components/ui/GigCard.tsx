import './GigCard.css';

const GigCard = () => {
    return (
        <div className="gig-card pit-window">
            <div className="pit-header">
                <span className="pit-title">COMMISSIONS</span>
                <span className="pit-status">OPEN</span>
            </div>

            <div className="pit-body">
                <div className="strategy-pill">
                    <span className="strat-icon">M</span>
                    <span className="strat-name">UI/UX DESIGN</span>
                </div>
                <div className="strategy-pill">
                    <span className="strat-icon" style={{ borderColor: '#fff', color: '#fff' }}>H</span>
                    <span className="strat-name">FULL STACK</span>
                </div>
                <div className="strategy-pill">
                    <span className="strat-icon" style={{ borderColor: '#e10600', color: '#e10600' }}>S</span>
                    <span className="strat-name">YT ASSETS</span>
                </div>
            </div>

            <div className="pit-footer">
                powered by <span style={{ fontWeight: 800, marginLeft: '4px' }}>SPiceZ</span>
            </div>
        </div>
    );
};

export default GigCard;
