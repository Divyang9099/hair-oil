import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>સંપર્ક કરો</h3>
                        <p>📧 Email: <a href="mailto:gujaratidivyang212@gmail.com">gujaratidivyang212@gmail.com</a></p>
                        <p>📞 ફોન: <a href="tel:+919909654359">+91 9909654359</a></p>
                        <p>🌐 વેબસાઈટ: <a href="https://gujarati-divyang.vercel.app/" target="_blank" rel="noopener noreferrer">www.aahairoil.com</a></p>
                    </div>
                    <div className="footer-section">
                        <h3>ઝડપી લિંક્સ</h3>
                        <a href="#home">મુખ્ય પેજ</a>
                        <a href="#benefits">ફાયદાઓ</a>
                        <a href="#about">અમારા વિશે</a>
                        <a href="#order">ઓર્ડર કરો</a>
                        <a href="#/admin" onClick={(e) => { e.preventDefault(); window.location.hash = '#/admin'; window.location.reload() }}>એડમિન</a>
                    </div>
                    <div className="footer-section">
                        <h3>અમારા વિશે</h3>
                        <p>૨૦ વર્ષથી શુદ્ધ આયુર્વેદિક હેર ઓઇલ બનાવતા અંબાલાના વારસાના વૈદ્ય.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Kesh Rasayana. બધા અધિકારો સુરક્ષિત.</p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
