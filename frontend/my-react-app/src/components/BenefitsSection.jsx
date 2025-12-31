import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const BenefitsSection = () => {
    const [showAll, setShowAll] = useState(false);

    const benefits = [
        {
            icon: "🛡️",
            title: "વાળ ખરતા અટકાવે છે",
            desc: "આયુર્વેદિક તેલમાં રહેલા ભૃંગરાજ, આમળા અને બ્રાહ્મી જેવા તત્વો વાળના મૂળને મજબૂત બનાવે છે, જેનાથી વાળ ખરવાનું પ્રમાણ ઘટે છે. (Reduces Hair Fall)"
        },
        {
            icon: "🌱",
            title: "નવા વાળ ઉગાડવામાં મદદરૂપ",
            desc: "તેલથી માલિશ કરવાથી માથામાં રક્ત પરિભ્રમણ (Blood Circulation) વધે છે, જે નવા વાળ ઉગાડવામાં અને વાળની લંબાઈ વધારવામાં મદદ કરે છે. (Promotes Hair Growth)"
        },
        {
            icon: "✨",
            title: "ખોડો અને ખંજવાળ દૂર કરે છે",
            desc: "લીમડો (Neem) અને કપૂર જેવા આયુર્વેદિક તત્વોમાં એન્ટી-બેક્ટેરિયલ ગુણો હોય છે, જે માથાની ત્વચા (Scalp) ને સાફ રાખે છે અને ખોડો તેમજ ખંજવાળ દૂર કરે છે. (Eliminates Dandruff)"
        },
        {
            icon: "🖤",
            title: "અકાળે સફેદ થતા વાળ અટકાવે છે",
            desc: "આયુર્વેદિક તેલ વાળને કુદરતી પોષણ આપે છે, જેનાથી નાની ઉંમરમાં વાળ સફેદ થવાની સમસ્યા ઓછી થાય છે. (Prevents Premature Greening)"
        },
        {
            icon: "🌟",
            title: "વાળને કુદરતી ચમક આપે છે",
            desc: "કેમિકલયુક્ત તેલની સરખામણીમાં, આયુર્વેદિક તેલ વાળને અંદરથી કન્ડિશનિંગ કરે છે, જેનાથી વાળ રેશમી અને ચમકદાર બને છે. (Adds Natural Shine)"
        },
        {
            icon: "😴",
            title: "માનસિક શાંતિ અને સારી ઊંઘ",
            desc: "આયુર્વેદિક તેલથી માલિશ કરવાથી મગજ શાંત રહે છે, તણાવ (Stress) ઓછો થાય છે અને રાત્રે ખૂબ જ સારી ઊંઘ આવે છે. (Stress Relief & Better Sleep)"
        },
        {
            icon: "✂️",
            title: "બે મોઢાવાળા વાળની સમસ્યામાં રાહત",
            desc: "વાળને પૂરતું મોઈશ્ચર મળવાથી વાળ વચ્ચેથી તૂટતા નથી અને બે મોઢાવાળા વાળની સમસ્યા ઉકેલાય છે. (Prevents Split Ends)"
        }
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
                <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>ફાયદાઓ</motion.h2>

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
                                key={benefit.title} // Use title as key for proper AnimatePresence work
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
                        {showAll ? 'ઓછા બતાવો' : 'બધા ફાયદાઓ જુઓ'}
                    </button>
                </motion.div>
            </div>
        </section >
    );
};

export default BenefitsSection;
