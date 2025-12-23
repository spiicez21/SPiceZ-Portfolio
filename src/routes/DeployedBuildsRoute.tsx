
import SharedLayout from '../components/layout/SharedLayout';
import FooterBar from '../components/layout/FooterBar';
import DeployedBuilds from '../components/sections/DeployedBuilds';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const DeployedBuildsRoute = () => {
    return (
        <PageTransition>
            <SharedLayout>
                <BackButton />
                <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                    <DeployedBuilds />
                </main>
                <FooterBar />
            </SharedLayout>
        </PageTransition>
    );
};

export default DeployedBuildsRoute;
