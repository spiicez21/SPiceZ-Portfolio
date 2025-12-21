
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import DeployedBuilds from '../components/sections/DeployedBuilds';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const DeployedBuildsRoute = () => {
    return (
        <PageTransition>
            <div className="portfolio-page">
                <NavBar />
                <BackButton />
                <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                    <DeployedBuilds />
                </main>
                <FooterBar />
            </div>
        </PageTransition>
    );
};

export default DeployedBuildsRoute;
