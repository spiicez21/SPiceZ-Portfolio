
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import InProgressProcesses from '../components/sections/InProgressProcesses';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const InProgressRoute = () => {
    return (
        <PageTransition>
            <div className="portfolio-page">
                <NavBar />
                <BackButton />
                <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                    <InProgressProcesses />
                </main>
                <FooterBar />
            </div>
        </PageTransition>
    );
};

export default InProgressRoute;
