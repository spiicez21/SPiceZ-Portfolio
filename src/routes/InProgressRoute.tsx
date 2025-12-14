
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import InProgressProcesses from '../components/sections/InProgressProcesses';

const InProgressRoute = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                <InProgressProcesses />
            </main>
            <FooterBar />
        </div>
    );
};

export default InProgressRoute;
