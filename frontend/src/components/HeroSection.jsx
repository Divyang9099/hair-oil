import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { containerVariants, itemVariants } from '../utils/animations';

const HeroSection = ({ onOrderClick }) => {
    const { t } = useTranslation();

    return (
        <section id="home" className="hero-section">
            <div className="hero-bg-wrapper">
                {/* Background Image Removed - Uses CSS Gradient .hero-bg-wrapper */}
            </div>

            <div className="container hero-content-center">
                <motion.div
                    className="hero-text-block"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants}>
                        {t('hero.title')}
                    </motion.h1>
                    <motion.p className="sub-headline" variants={itemVariants}>
                        {t('hero.subtitle')}
                    </motion.p>
                    <motion.button
                        onClick={onOrderClick}
                        className="btn-primary"
                        variants={itemVariants}
                        whileHover={{ scale: 1.08, y: -3, boxShadow: "0 8px 20px rgba(0, 100, 0, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{ border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '1rem 2rem' }}
                    >
                        {t('hero.button')}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
