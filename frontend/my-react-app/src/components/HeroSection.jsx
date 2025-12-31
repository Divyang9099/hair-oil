import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const HeroSection = () => {
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
                        Kesh Rasayana: ૨૦ વર્ષનો અનુભવ, અંબાલાની ઔષધીઓનો વારસો
                    </motion.h1>
                    <motion.p className="sub-headline" variants={itemVariants}>
                        ખરતા વાળ, ખોડો, અને ઉંદરી જેવી સમસ્યાઓ માટે આયુર્વેદિક ઉપચાર.
                    </motion.p>
                    <motion.a
                        href="#order"
                        className="btn-primary"
                        variants={itemVariants}
                        whileHover={{ scale: 1.08, y: -3, boxShadow: "0 8px 20px rgba(0, 100, 0, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        હમણાં જ ઓર્ડર કરો
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
