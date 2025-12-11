import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import HeroBootSequence from '../components/sections/HeroBootSequence';
import WhoAmI from '../components/sections/WhoAmI';
import StackTrace from '../components/sections/StackTrace';
import DeployedBuilds from '../components/sections/DeployedBuilds';
import PixelLab from '../components/sections/PixelLab';
import InProgressProcesses from '../components/sections/InProgressProcesses';
import VerifiedCredentials from '../components/sections/VerifiedCredentials';
import BossesDefeated from '../components/sections/BossesDefeated';
import GitHubActivity from '../components/sections/GitHubActivity';
import OpenTicket from '../components/sections/OpenTicket';

const Portfolio = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px' }}>
                <HeroBootSequence />
                <WhoAmI />
                <StackTrace />
                <DeployedBuilds />
                <PixelLab />
                <InProgressProcesses />
                <VerifiedCredentials />
                <BossesDefeated />
                <GitHubActivity />
                <OpenTicket />
            </main>
            <FooterBar />
        </div>
    );
};

export default Portfolio;
