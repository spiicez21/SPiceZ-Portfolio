
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import PixelLab from '../components/sections/PixelLab';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const PixelLabRoute = () => {
    return (
        <PageTransition>
            <div className="portfolio-page">
                <NavBar />
                <BackButton />
                <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                    <PixelLab />
                </main>
                <FooterBar />
            </div>
        </PageTransition>
    );
};

export default PixelLabRoute;
