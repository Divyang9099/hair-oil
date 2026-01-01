import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
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

                <ul className="nav-links">
                    <motion.li
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                    >
                        <button
                            className="theme-toggle-btn"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </motion.li>

                    {['#home', '#benefits', '#about', '#order'].map((href, index) => (
                        <motion.li
                            key={href}
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
                            <a href={href}>{href === '#home' ? 'મુખ્ય પેજ' : href === '#benefits' ? 'ફાયદાઓ' : href === '#about' ? 'અમારા વિશે' : 'ઓર્ડર કરો'}</a>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </motion.header>
    );
};

export default Navbar;
