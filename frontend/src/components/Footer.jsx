import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <motion.footer initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>{t('footer.contact')}</h3>
                        <p>📧 Email: <a href="mailto:gujaratidivyang212@gmail.com">gujaratidivyang212@gmail.com</a></p>
                        <p>📞 {t('footer.phone_label')}: <a href="tel:+919909654359">+91 9909654359</a></p>
                        <p>🌐 {t('footer.website_label')}: <a href="https://gujarati-divyang.vercel.app/" target="_blank" rel="noopener noreferrer">www.aahairoil.com</a></p>
                    </div>
                    <div className="footer-section">
                        <h3>{t('footer.quick_links')}</h3>
                        <a href="#home">{t('nav.home')}</a>
                        <a href="#benefits">{t('nav.benefits')}</a>
                        <a href="#about">{t('nav.about')}</a>
                        <a href="#order">{t('nav.order')}</a>
                        <a href="#/admin" onClick={(e) => { e.preventDefault(); window.location.hash = '#/admin'; window.location.reload() }}>{t('footer.admin')}</a>
                    </div>
                    <div className="footer-section">
                        <h3>{t('footer.about_title')}</h3>
                        <p>{t('footer.about_desc')}</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Kesh Rasayana. {t('footer.rights')}</p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
