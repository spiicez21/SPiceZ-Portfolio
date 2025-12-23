
import SharedLayout from '../components/layout/SharedLayout';
import FooterBar from '../components/layout/FooterBar';
import InProgressProcesses from '../components/sections/InProgressProcesses';
import BackButton from '../components/ui/BackButton';
import PageTransition from '../components/utils/PageTransition';

const InProgressRoute = () => {
    return (
        <PageTransition>
            <SharedLayout>
                <BackButton />
                <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
                    <InProgressProcesses />
                </main>
                <FooterBar />
            </SharedLayout>
        </PageTransition>
    );
};

export default InProgressRoute;
