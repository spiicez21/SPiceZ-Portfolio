
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import DeployedBuilds from '../components/sections/DeployedBuilds';

const DeployedBuildsRoute = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                <DeployedBuilds />
            </main>
            <FooterBar />
        </div>
    );
};

export default DeployedBuildsRoute;
