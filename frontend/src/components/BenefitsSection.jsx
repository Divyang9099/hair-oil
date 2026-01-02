import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { containerVariants, itemVariants } from '../utils/animations';

const BenefitsSection = () => {
    const [showAll, setShowAll] = useState(false);
    const { t } = useTranslation();

    const benefits = [
        { icon: "🛡️", title: t('benefits.stop_fall'), desc: t('benefits.stop_fall_desc') },
        { icon: "🌱", title: t('benefits.regrowth'), desc: t('benefits.regrowth_desc') },
        { icon: "✨", title: t('benefits.dandruff'), desc: t('benefits.dandruff_desc') },
        { icon: "🖤", title: t('benefits.graying'), desc: t('benefits.graying_desc') },
        { icon: "🌟", title: t('benefits.shine'), desc: t('benefits.shine_desc') },
        { icon: "😴", title: t('benefits.peace'), desc: t('benefits.peace_desc') },
        { icon: "✂️", title: t('benefits.split_ends'), desc: t('benefits.split_ends_desc') }
    ];

    // Check hash on mount and change to auto-expand if navigated via navbar
    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash === '#benefits') {
                setShowAll(true);
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    const visibleBenefits = showAll ? benefits : benefits.slice(0, 3);

    return (
        <section id="benefits" className="section">
            <div className="container">
                <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    {t('benefits.title')}
                </motion.h2>

                <motion.div
                    className="benefits-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <AnimatePresence mode='popLayout'>
                        {visibleBenefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                className="benefit-card"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                                whileHover={{ translateY: -10, scale: 1.03, rotateY: 5 }}
                            >
                                <motion.div className="benefit-icon">{benefit.icon}</motion.div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    style={{ textAlign: 'center', marginTop: '3rem' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        className="btn-secondary"
                        onClick={() => setShowAll(!showAll)}
                        style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}
                    >
                        {showAll ? t('benefits.show_less') : t('benefits.show_more')}
                    </button>
                </motion.div>
            </div>
        </section >
    );
};

export default BenefitsSection;
