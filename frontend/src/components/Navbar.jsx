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

                {/* Desktop/Mobile Common Controls */}
                <div className="nav-controls">
                    {/* Theme Toggle - Visible on Mobile and Desktop */}
                    <button
                        className="theme-toggle-btn"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {/* Mobile Only: Lang select and Hamburger */}
                    <select
                        className="lang-select mobile-only"
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        aria-label="Change Language"
                    >
                        <option value="gu">Gujarati</option>
                        <option value="en">English</option>
                    </select>

                    <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                        >
                            <motion.ul
                                className="nav-links mobile-active"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <li className="mobile-menu-header">
                                    <span className="logo-small">Kesh Rasayana</span>
                                    <button className="close-menu" onClick={toggleMenu}>✕</button>
                                </li>
                                {navItems.map((item, index) => (
                                    <motion.li
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                                            <span className="nav-icon">{index === 0 ? '🏠' : index === 1 ? '✨' : index === 2 ? '🌿' : '🛒'}</span>
                                            {item.label}
                                        </a>
                                    </motion.li>
                                ))}
                                <li className="mobile-menu-footer">
                                    <div className="menu-controls">
                                        <button
                                            className="theme-toggle-btn"
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                        >
                                            {isDarkMode ? '☀️' : '🌙'}
                                        </button>
                                    </div>
                                </li>
                            </motion.ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ul className="nav-links desktop-only-flex">
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
                        </div>
                    </li>

                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.href}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a href={item.href}>{item.label}</a>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </motion.header>
    );
};

export default Navbar;
