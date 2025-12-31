import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import AboutSection from '../components/AboutSection';
import OrderSection from '../components/OrderSection';
import Footer from '../components/Footer';

const LandingPage = ({ isDarkMode, setIsDarkMode, serverStatus }) => {
    return (
        <>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <HeroSection />
            <BenefitsSection />
            <AboutSection />
            <OrderSection serverStatus={serverStatus} />
            <Footer />
        </>
    );
};

export default LandingPage;
