import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import AboutSection from '../components/AboutSection';
import OrderSection from '../components/OrderSection';
import Footer from '../components/Footer';
import LeadPopup from '../components/LeadPopup';
import React, { useState } from 'react';

const LandingPage = ({ isDarkMode, setIsDarkMode, serverStatus }) => {
    const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
    const [partialOrder, setPartialOrder] = useState(null);

    const handleOpenLeadPopup = () => {
        setIsLeadPopupOpen(true);
    };

    const handleLeadSuccess = (orderData) => {
        setPartialOrder(orderData);
        // Scroll to order section
        const orderSection = document.getElementById('order');
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <HeroSection onOrderClick={handleOpenLeadPopup} />
            <BenefitsSection />
            <AboutSection />
            <OrderSection serverStatus={serverStatus} partialOrder={partialOrder} />
            <Footer />
            <LeadPopup
                isOpen={isLeadPopupOpen}
                onClose={() => setIsLeadPopupOpen(false)}
                onSuccess={handleLeadSuccess}
            />
        </>
    );
};

export default LandingPage;
