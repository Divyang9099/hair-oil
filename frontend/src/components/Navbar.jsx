import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const navItems = [
        { href: '#home', label: t('nav.home') },
        { href: '#benefits', label: t('nav.benefits') },
        { href: '#about', label: t('nav.about') },
        { href: '#order', label: t('nav.order') }
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
        >
            <nav className="container">
                <motion.a
                    href="#"
                    className="logo"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src="/kesh_rasayana_logo.jpg" alt="Kesh Rasayana" style={{ height: '40px', marginRight: '10px', borderRadius: '50%' }} />
                    Kesh Rasayana
                </motion.a>

                {/* Mobile Controls */}
                <div className="nav-controls">
                    <select
                        className="lang-select mobile-only"
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        aria-label="Change Language"
                    >
                        <option value="gu">Gujarati</option>
                        <option value="en">English</option>
                    </select>

                    <button
                        className="theme-toggle-btn mobile-only"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>

                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li className="desktop-only">
                        <div className="nav-desktop-controls">
                            <select
                                className="lang-select"
                                onChange={(e) => changeLanguage(e.target.value)}
                                value={i18n.language}
                            >
                                <option value="gu">Gujarati</option>
                                <option value="en">English</option>
                            </select>

                            <button
                                className="theme-toggle-btn"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </li>

                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: 30, y: -20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.3 + index * 0.1,
                                type: "spring",
                                stiffness: 150
                            }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a href={item.href} onClick={() => setIsMenuOpen(false)}>{item.label}</a>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </motion.header>
    );
};

export default Navbar;
