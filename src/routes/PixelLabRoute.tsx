
import SharedLayout from '../components/layout/SharedLayout';
import FooterBar from '../components/layout/FooterBar';
import PixelLab from '../components/sections/PixelLab';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const PixelLabRoute = () => {
    return (
        <PageTransition>
            <SharedLayout>
                <BackButton />
                <main style={{ paddingTop: '5rem', minHeight: '100vh' }}>
                    <PixelLab />
                </main>
                <FooterBar />
            </SharedLayout>
        </PageTransition>
    );
};

export default PixelLabRoute;
