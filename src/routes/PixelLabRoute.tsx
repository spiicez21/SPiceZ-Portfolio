
import NavBar from '../components/layout/NavBar';
import FooterBar from '../components/layout/FooterBar';
import PixelLab from '../components/sections/PixelLab';

const PixelLabRoute = () => {
    return (
        <div className="portfolio-page">
            <NavBar />
            <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                <PixelLab />
            </main>
            <FooterBar />
        </div>
    );
};

export default PixelLabRoute;
